import { Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Grid } from '@mui/material';
import FormFields from './FormFields';

const validationSchema = Yup.object().shape({
    type: Yup.string().required('Required'),
    amount: Yup.number()
        .positive('Amount must be positive')
        .required('Required'),
    categoryId: Yup.string().nullable(),
    date: Yup.date().required('Required'),
    comment: Yup.string().nullable()
});

const TransactionForm = ({ initialValues, onSubmit, categories }) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <FormFields categories={categories} />
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    sx={{
                                        background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
                                        py: 2,
                                        borderRadius: 2,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            boxShadow: '0 4px 8px rgba(67, 97, 238, 0.3)'
                                        }
                                    }}
                                >
                                    {initialValues.id ? 'Update Transaction' : 'Create Transaction'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default TransactionForm;