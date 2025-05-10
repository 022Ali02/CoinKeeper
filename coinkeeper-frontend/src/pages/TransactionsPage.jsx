import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { Box, Button, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import TransactionTable from '../components/transactions/TransactionTable/TransactionTable';
import TransactionModal from '../components/transactions/TransactionModal/TransactionModal';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);
    const api = useApi();

    const fetchTransactions = async () => {
        try {
            const data = await api.get('/transactions');
            setTransactions(data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSubmit = async (values) => {
        try {
            if (currentTransaction) {
                await api.put(`/transactions/${currentTransaction.id}`, values);
            } else {
                await api.post('/transactions', values);
            }
            fetchTransactions();
            setOpenModal(false);
        } catch (error) {
            console.error('Failed to save transaction:', error);
        }
    };

    return (
        <>
            <PageHeader
                title="Transactions"
                action={
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => {
                            setCurrentTransaction(null);
                            setOpenModal(true);
                        }}
                        sx={{
                            background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        New Transaction
                    </Button>
                }
            />

            <Box mt={4}>
                <TransactionTable
                    transactions={transactions}
                    onEdit={(transaction) => {
                        setCurrentTransaction(transaction);
                        setOpenModal(true);
                    }}
                    onDelete={async (id) => {
                        try {
                            await api.delete(`/transactions/${id}`);
                            fetchTransactions();
                        } catch (error) {
                            console.error('Failed to delete transaction:', error);
                        }
                    }}
                />
            </Box>

            <TransactionModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={handleSubmit}
                transaction={currentTransaction}
            />
        </>
    );
};

export default TransactionsPage;