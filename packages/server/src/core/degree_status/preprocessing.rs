use std::collections::HashMap;

use crate::{
    core::messages,
    resources::{
        catalog::Catalog,
        course::{Course, CourseId, CourseState},
    },
};

use super::DegreeStatus;

impl DegreeStatus {
    // Courses that are not modified, not completed, and don't have a semester should be removed,
    // since they were not added by the user and they are irrelevant to the new catalog
    fn remove_courses_added_by_algorithm(&mut self) {
        self.course_statuses
            .retain(|cs| cs.modified || cs.completed() || cs.semester.is_some());
    }

    // courses which were tagged as irrelevant in a previous run, and then user added the same courses (same course id) manually, should be removed
    fn remove_irrelevant_courses_added_by_user(&mut self) {
        let dispensable_irrelevant_courses = self
            .course_statuses
            .iter()
            .filter(|course_status| {
                if course_status.state != Some(CourseState::Irrelevant) {
                    return false;
                }
                for optional_relevant_duplicate in self.course_statuses.iter() {
                    if optional_relevant_duplicate.modified
                        && optional_relevant_duplicate.state != Some(CourseState::Irrelevant)
                        && optional_relevant_duplicate.course.id == course_status.course.id
                    {
                        return true;
                    }
                }
                false
            })
            .map(|course_status| course_status.course.id.clone())
            .collect::<Vec<CourseId>>();
        self.course_statuses.retain(|course_status| {
            course_status.state != Some(CourseState::Irrelevant)
                || !dispensable_irrelevant_courses.contains(&course_status.course.id)
        });
    }

    fn clear_type_for_unmodified_and_irrelevant_courses(&mut self) {
        for course_status in self.course_statuses.iter_mut() {
            if !course_status.modified {
                course_status.r#type = None;
            } else if let Some(state) = &course_status.state {
                if *state == CourseState::Irrelevant {
                    course_status.r#type = None;
                }
            }
        }
    }

    fn remove_irrelevant_courses_from_catalog(&mut self, catalog: &mut Catalog) {
        for course_status in self.course_statuses.iter() {
            if let Some(state) = &course_status.state {
                if *state == CourseState::Irrelevant {
                    catalog.course_to_bank.remove(&course_status.course.id);
                }
            }
        }
    }

    fn reset(&mut self, catalog: &mut Catalog) {
        self.course_bank_requirements.clear();
        self.overflow_msgs.clear();
        self.total_credit = 0.0;

        self.remove_courses_added_by_algorithm();
        self.remove_irrelevant_courses_added_by_user();
        self.clear_type_for_unmodified_and_irrelevant_courses();
        self.remove_irrelevant_courses_from_catalog(catalog);
    }

    fn get_all_student_replacements_and_set_msg(
        &mut self,
        catalog: &Catalog,
        courses: &HashMap<CourseId, Course>,
    ) -> HashMap<CourseId, CourseId> {
        let mut student_replacements = HashMap::new();
        self.course_statuses.iter_mut().for_each(|course| {
            let mut find_replacement =
                |replacements: &HashMap<String, Vec<String>>,
                 replacements_msg: fn(&Course) -> String| {
                    replacements
                        .iter()
                        .for_each(|(course_id, optional_replacements)| {
                            optional_replacements.contains(course_id).then(|| {
                                student_replacements
                                    .insert(course_id.clone(), course.course.id.clone());

                                course.set_msg(replacements_msg(courses.get(course_id).unwrap_or(
                                    &Course {
                                        id: course_id.clone(),
                                        ..Default::default()
                                    },
                                )));
                            });
                        })
                };

            find_replacement(
                &catalog.catalog_replacements,
                messages::catalog_replacement_msg,
            );
            find_replacement(
                &catalog.common_replacements,
                messages::common_replacement_msg,
            );
        });

        student_replacements
    }

    // This function iterates over the course statuses and if it finds a course a student took which is a replacement for a course in the catalog
    // it replaces the course in the catalog with the course the student took
    fn replace_student_course_with_courses_in_catalog(
        &mut self,
        catalog: &mut Catalog,
        courses: &HashMap<CourseId, Course>,
    ) {
        let student_replacements = self.get_all_student_replacements_and_set_msg(catalog, courses);
        student_replacements
            .iter()
            .for_each(|(course_id, replacement)| {
                catalog.replace_courses(course_id, replacement);
            });
    }

    pub fn preprocess(&mut self, catalog: &mut Catalog, courses: &HashMap<CourseId, Course>) {
        self.reset(catalog);

        self.course_statuses.sort_by(|c1, c2| {
            c1.extract_semester()
                .partial_cmp(&c2.extract_semester())
                .unwrap_or(std::cmp::Ordering::Equal)
            // partial_cmp returns None if one of the two values are NaN, which should never happen
            // still, to be on the safe side, we use Ordering::Equal in that case instead of unwrapping
        });

        self.replace_student_course_with_courses_in_catalog(catalog, courses);
    }
}
