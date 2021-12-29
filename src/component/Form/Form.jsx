import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import data from '../../data.json'
import { Input } from '@mui/material';

export default function Form() {
  const step = data; //if need pars write step = JSON.parse(data)
  const [activeStep, setActiveStep] = React.useState(0);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [inputDirty, setInputDirty] = useState(false);
  const pattern = new RegExp(step[activeStep]?.regex);

  useEffect(() => {
    if (error) {
      setInputDirty(false)
    } else {
      setInputDirty(true)
    }
  }, [error])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const changeHandler = (e) => {
    const key = e.target.getAttribute('name')
    setForm({
      ...form,
      [key]: e.target.value
    })
    switch (true) {
      case (e.target.value.length === 0):
        setError('Cannot be empty')
        break
      case (step[activeStep].min_length && e.target.value.length < step[activeStep].min_length):
        setError(`Cannot be less ${step[activeStep].min_length}`)
        break
      case (step[activeStep].max_length && e.target.value.length > step[activeStep].max_length):
        setError(`Cannot be more ${step[activeStep].max_length}`)
        break
      case (pattern && !pattern.test(e.target.value)):
        setError('Incorrect entry ')
        break
      default:
        setError('')
        break
    }
  };

  const finish = () => {
    console.log('====>form<====', form)
    setActiveStep(0)
    setForm({})
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
        justifyContent: 'center',
      }}
      className='container'
    >
      <Box sx={{maxWidth: 400}}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {step.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                {step.label}
              </StepLabel>
              <StepContent>
                <Box sx={{mb: 2, ml: 10, height: 80}}>
                  <Box sx={{height: 70}}>
                    {error ? <Box sx={{color: 'red', fontSize: 13, mb: 3}}>{error}</Box> :
                      <Box sx={{height: 38}}>{null}</Box>}
                    <Input
                      value={form[step.name] || ''}
                      className='form-input'
                      name={step.name}
                      onChange={changeHandler}
                      type={step.type}
                    />
                    <div>
                      <Button
                        size={"small"}
                        variant="contained"
                        onClick={handleNext}
                        sx={{mt: 1, mr: 1}}
                        disabled={!inputDirty}
                      >
                        {index === step.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                      <Button
                        size={"small"}
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{mt: 1, mr: 1}}
                      >
                        Back
                      </Button>
                    </div>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === step.length && (
          <Paper square elevation={0} sx={{p: 3, ml: 20}}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button
              onClick={finish}
              sx={{mt: 1, mr: 1}}
              size={"small"}
            >
              Finish
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
};
