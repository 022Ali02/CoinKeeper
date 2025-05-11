import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Select, MenuItem, Button, Box, FormControl, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const TransactionSchema = Yup.object().shape({
    amount: Yup.number().positive('Amount must be positive').required('Required'),
    type: Yup.string().required('Required'),
    categoryId: Yup.string(),
    date: Yup.date().required('Required'),
    comment: Yup.string()
});

const TransactionForm = ({ transaction, onSubmit }) => {
    return (
        <Formik
            initialValues={{
                amount: transaction?.amount || '',
                type: transaction?.type || 'EXPENSE',
                categoryId: transaction?.categoryId || '',
                date: transaction?.date ? new Date(transaction.date) : new Date(),
                comment: transaction?.comment || ''
            }}
            validationSchema={TransactionSchema}
            onSubmit={(values, { setSubmitting }) => {
                onSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Field name="type">
                            {({ field, meta }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        {...field}
                                        label="Type"
                                        error={meta.touched && !!meta.error}
                                    >
                                        <MenuItem value="INCOME">Income</MenuItem>
                                        <MenuItem value="EXPENSE">Expense</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        </Field>

                        <Field name="amount">
                            {({ field, meta }) => (
                                <TextField
                                    {...field}
                                    label="Amount"
                                    type="number"
                                    fullWidth
                                    error={meta.touched && !!meta.error}
                                    helperText={meta.touched && meta.error}
                                />
                            )}
                        </Field>

                        <Field name="date">
                            {({ field, meta }) => (
                                <DatePicker
                                    label="Date"
                                    value={field.value}
                                    onChange={(date) => setFieldValue('date', date)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            error={meta.touched && !!meta.error}
                                            helperText={meta.touched && meta.error}
                                        />
                                    )}
                                />
                            )}
                        </Field>

                        <Field name="comment">
                            {({ field, meta }) => (
                                <TextField
                                    {...field}
                                    label="Comment"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    error={meta.touched && !!meta.error}
                                    helperText={meta.touched && meta.error}
                                />
                            )}
                        </Field>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{ mt: 2 }}
                        >
                            {transaction ? 'Update' : 'Create'} Transaction
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default TransactionForm;