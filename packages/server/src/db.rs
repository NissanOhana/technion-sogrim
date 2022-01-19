use crate::catalog::Catalog;
use crate::config::CONFIG;
use crate::course::{Course, Malags};
use crate::user::User;
use actix_web::error::{self, Error};
pub use bson::{doc, Document};
use mongodb::Client;

pub mod services {

    use crate::catalog::DisplayCatalog;

    use super::*;
    use actix_web::error::ErrorInternalServerError;
    use bson::oid::ObjectId;
    use futures_util::TryStreamExt;
    use mongodb::options::{FindOneAndUpdateOptions, ReturnDocument, UpdateModifications};

    #[macro_export]
    macro_rules! impl_get {
        (
            fn_name : $fn_name:ident,
            db_item : $db_item:ty,
            db_key_type : $db_key_type:ty

        ) => {
            #[allow(dead_code)] // TODO: remove this
            pub async fn $fn_name(item: $db_key_type, client: &Client) -> Result<$db_item, Error> {
                match client
                    .database(CONFIG.profile)
                    .collection::<$db_item>(format!("{}s", stringify!($db_item)).as_str())
                    .find_one(doc! {"_id" : item}, None)
                    .await
                {
                    Ok(Some(item)) => Ok(item),
                    Ok(None) => Err(error::ErrorNotFound(item.to_string())),
                    Err(err) => {
                        eprintln!("{:#?}", err);
                        Err(error::ErrorInternalServerError(err.to_string()))
                    }
                }
            }
        };
    }

    #[macro_export]
    macro_rules! impl_get_all {
        (
            fn_name : $fn_name:ident,
            db_item : $db_item:ty,
            db_coll_name : $db_coll_name:literal

        ) => {
            pub async fn $fn_name(client: &Client) -> Result<Vec<$db_item>, Error> {
                match client
                    .database(CONFIG.profile)
                    .collection::<$db_item>($db_coll_name)
                    .find(None, None)
                    .await
                {
                    Ok(docs) => Ok(docs
                        .try_collect::<Vec<$db_item>>()
                        .await
                        .map_err(|e| ErrorInternalServerError(e.to_string()))?),
                    Err(err) => Err(ErrorInternalServerError(err.to_string())),
                }
            }
        };
    }

    #[macro_export]
    macro_rules! impl_update {
        (
            fn_name : $fn_name:ident,
            db_item : $db_item:ty,
            db_key_type : $db_key_type:ty,
            db_coll_name : $db_coll_name:literal

        ) => {
            #[allow(dead_code)] // TODO: remove this
            pub async fn $fn_name(
                id: $db_key_type,
                document: Document,
                client: &Client,
            ) -> Result<$db_item, Error> {
                match client
                    .database(CONFIG.profile)
                    .collection::<$db_item>($db_coll_name)
                    .find_one_and_update(
                        doc! {"_id" : id},
                        UpdateModifications::Document(document),
                        Some(
                            FindOneAndUpdateOptions::builder()
                                .upsert(true)
                                .return_document(ReturnDocument::After)
                                .build(),
                        ),
                    )
                    .await
                {
                    // We can safely unwrap here thanks to upsert=true and ReturnDocument::After
                    Ok(item) => Ok(item.unwrap()),
                    Err(err) => {
                        let err = format!("monogdb driver error: {}", err);
                        eprintln!("{}", err);
                        Err(ErrorInternalServerError(err))
                    }
                }
            }
        };
    }

    #[macro_export]
    macro_rules! impl_delete {
        (
            fn_name : $fn_name:ident,
            db_item : $db_item:ty,
            db_key_type : $db_key_type:ty,
            db_coll_name : $db_coll_name:literal

        ) => {
            #[allow(dead_code)] // TODO: remove this
            pub async fn $fn_name(id: $db_key_type, client: &Client) -> Result<(), Error> {
                match client
                    .database(CONFIG.profile)
                    .collection::<$db_item>($db_coll_name)
                    .delete_one(doc! {"_id" : id}, None)
                    .await
                {
                    Ok(_) => Ok(()),
                    Err(err) => {
                        let err = format!("monogdb driver error: {}", err);
                        eprintln!("{}", err);
                        Err(ErrorInternalServerError(err))
                    }
                }
            }
        };
    }

    impl_get!(
        fn_name: get_catalog_by_id,
        db_item: Catalog,
        db_key_type: &ObjectId
    );

    impl_get_all!(
        fn_name: get_all_catalogs,
        db_item: DisplayCatalog,
        db_coll_name: "Catalogs"
    );

    impl_update!(
        fn_name: find_and_update_catalog,
        db_item: Catalog,
        db_key_type: &ObjectId,
        db_coll_name: "Catalogs"
    );

    impl_delete!(
        fn_name: delete_catalog,
        db_item: Catalog,
        db_key_type: &ObjectId,
        db_coll_name: "Catalogs"
    );

    impl_get!(
        fn_name: get_course_by_number,
        db_item: Course,
        db_key_type: &str
    );

    impl_get_all!(
        fn_name: get_all_courses,
        db_item: Course,
        db_coll_name: "Courses"
    );

    impl_update!(
        fn_name: find_and_update_course,
        db_item: Course,
        db_key_type: &str,
        db_coll_name: "Courses"
    );

    impl_delete!(
        fn_name: delete_course,
        db_item: Course,
        db_key_type: &str,
        db_coll_name: "Courses"
    );

    impl_get_all!(
        fn_name: get_all_malags,
        db_item: Malags,
        db_coll_name: "Malags"
    );

    impl_get!(fn_name: get_user_by_id, db_item: User, db_key_type: &str);

    impl_update!(
        fn_name: find_and_update_user,
        db_item: User,
        db_key_type: &str,
        db_coll_name: "Users"
    );
}
