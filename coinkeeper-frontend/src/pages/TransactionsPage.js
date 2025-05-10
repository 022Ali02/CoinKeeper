import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionAPI } from '../index';
import TransactionForm from '../components/Transactions/TransactionForm/TransactionForm';
import TransactionList from '../components/Transactions/TransactionList';
import { Button, Modal, Box, Typography } from '@mui/material';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchTransactions();
        }
    }, [user]);

    const fetchTransactions = async () => {
        try {
            const response = await transactionAPI.getAll();
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleCreate = async (transaction) => {
        try {
            await transactionAPI.create(transaction);
            fetchTransactions();
            setOpenModal(false);
        } catch (error) {
            console.error('Error creating transaction:', error);
        }
    };

    const handleUpdate = async (id, transaction) => {
        try {
            await transactionAPI.update(id, transaction);
            fetchTransactions();
            setOpenModal(false);
            setEditingTransaction(null);
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await transactionAPI.delete(id);
            fetchTransactions();
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Transactions
            </Typography>
            <Button
                variant="contained"
                onClick={() => setOpenModal(true)}
                sx={{ mb: 3 }}
            >
                Add Transaction
            </Button>

            <TransactionList
                transactions={transactions}
                onEdit={(transaction) => {
                    setEditingTransaction(transaction);
                    setOpenModal(true);
                }}
                onDelete={handleDelete}
            />

            <Modal open={openModal} onClose={() => {
                setOpenModal(false);
                setEditingTransaction(null);
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 1
                }}>
                    <Typography variant="h6" gutterBottom>
                        {editingTransaction ? 'Edit' : 'Add'} Transaction
                    </Typography>
                    <TransactionForm
                        transaction={editingTransaction}
                        onSubmit={editingTransaction ?
                            (values) => handleUpdate(editingTransaction.id, values) :
                            handleCreate}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default TransactionsPage;