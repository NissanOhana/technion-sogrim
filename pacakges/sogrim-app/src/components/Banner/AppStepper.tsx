import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormModal } from '../Commom/FormModal';
import { SelectCatalog } from './BannerDialogs/SelectCatalog';
import { ExportGilion } from "./BannerDialogs/ExportGilion";
import { useStore } from '../../hooks/useStore';
import { useAuth } from '../../hooks/useAuth';
import useComputeEndGame from '../../hooks/apiHooks/useComputeEndGame';
import { observer } from 'mobx-react-lite';
import useUserState from '../../hooks/apiHooks/useUserState';

const steps = [
  {
    label: 'בחר קטלוג',
    description: `בחר קטלוג לימודים`,
  },
  {
    label: 'יבא קורסים',
    description: '',
  },
  {
    label: 'סגור את התואר!',
    description: ``,
  },
];

const AppStepperComp: React.FC = () => {
  const [coursesModalOpen, coursesModalsetOpen] = React.useState(false);  
  const [catalogsModalOpen, catalogsModalsetOpen] = React.useState(false);  
  const [triggerCompute, setTriggerCompute] = React.useState(false);  

  const [activeStep, setActiveStep] = React.useState<number>(0);
  const { uiStore: {
    userRegistrationState,
  } } = useStore();

  const { userAuthToken } = useAuth();
  const { data, isLoading, refetch} = useUserState(userAuthToken);
  const { data: tcData, isLoading: tcIsLoading, isError: tcIsError} = useComputeEndGame(userAuthToken, triggerCompute);

  React.useEffect(() => {
      const refreshStepper = async() => {
        if (data && !isLoading && (!coursesModalOpen || !catalogsModalOpen)) {
          const { data: newData} = await refetch();
          if (newData) {
            const rs = userRegistrationState(newData);            
            setActiveStep(rs);
          }
        }      
      }
      refreshStepper();

    }, [coursesModalOpen, catalogsModalOpen, data, setActiveStep, userRegistrationState, refetch, isLoading])



  React.useEffect(() => {
    if (tcIsError) {
      // TODO: error state
    } else if (tcData && !tcIsLoading) {
      setTriggerCompute(false);      
    }
  }, [tcData, tcIsLoading, tcIsError]);


  const coursesHandleClickOpen = () => {
    coursesModalsetOpen(true);
  };

  const coursesHandleClose = () => {
    coursesModalsetOpen(false);
  };

  const catalogsHandleClickOpen = () => {
    catalogsModalsetOpen(true);
  };

  const catalogsHandleClose = () => {
    catalogsModalsetOpen(false);
  };

  const handleTriggerCompute = () => {
    setTriggerCompute(true);
  }

  const handleOnClick = async (index: number) => {
    if (index === 0) {
      catalogsHandleClickOpen();
    } else if (index === 1) {
      coursesHandleClickOpen();                        
    } else if (index === 2) {
      handleTriggerCompute();
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ minWidth: 400, marginTop: '20px' }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
            color='white'   
              optional={
                index === 2 ? (
                  <Typography color='white' variant="caption">Last step</Typography>
                ) : null
              }
            >
              <Typography variant="h4">{step.label}</Typography>
              
            </StepLabel>
            <StepContent>
              <Typography color='white' >{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <Box>
                  <Button
                    variant="contained"
                    onClick={() => handleOnClick(index)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {step.label}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    חזור
                  </Button>
                </Box>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>   
        <FormModal dialogContent={<ExportGilion handleClose={coursesHandleClose} />} handleClose={coursesHandleClose} open={coursesModalOpen}/>
        <FormModal dialogContent={<SelectCatalog handleClose={catalogsHandleClose} />} handleClose={catalogsHandleClose} open={catalogsModalOpen}/>   
    </Box>
  );
}

export const AppStepper = observer(AppStepperComp);