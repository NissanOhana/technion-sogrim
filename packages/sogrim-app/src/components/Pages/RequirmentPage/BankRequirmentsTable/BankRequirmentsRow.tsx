import React from "react";
import { observer } from "mobx-react-lite";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import {
  ACCUMULATE_COURSES,
  CourseBankReq,
} from "../../../../types/data-types";
import { LinearProgressBar } from "./LinearProgressBar";
import { BankChip } from "./BankChip";

interface BankRequirmentRowProps {
  bankRequirment: CourseBankReq;
}

const BankRequirmentRowComp: React.FC<BankRequirmentRowProps> = ({
  bankRequirment,
}) => {
  const {
    course_bank_name,
    credit_completed,
    credit_requirement,
    course_completed,
    course_requirement,
    bank_rule_name,
  } = bankRequirment;

  const progress =
    bank_rule_name === ACCUMULATE_COURSES
      ? (course_completed / course_requirement) * 100
      : (credit_completed / credit_requirement) * 100;

  const subtitle =
    bank_rule_name === ACCUMULATE_COURSES
      ? `השלמת ${course_completed} מתוך ${course_requirement} קורסים`
      : `השלמת ${credit_completed} מתוך ${credit_requirement} נק״ז`;

  return (
    <Accordion sx={{ minWidth: 700 }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="req-row-collaps"
        id="req-row-collaps"
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                alignContent: "baseline",
                alignItems: "baseline",
              }}
            >
              <Typography fontWeight={"bold"}>{course_bank_name}</Typography>
              <BankChip progress={progress} />
            </Box>

            <Typography>{subtitle}</Typography>
          </Box>
          <Box sx={{ minWidth: 200 }}>
            <LinearProgressBar value={progress} />
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails> ya nazi</AccordionDetails>
    </Accordion>
  );
};

export const BankRequirmentRow = observer(BankRequirmentRowComp);
