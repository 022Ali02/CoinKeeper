import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { Box, Grid, Typography } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import IncomeExpenseChart from '../components/statistics/IncomeExpenseChart';
import CategoryDistribution from '../components/statistics/CategoryDistribution';

const StatisticsPage = () => {
    const [stats, setStats] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date()
    });
    const api = useApi();

    const fetchStats = async () => {
        try {
            const data = await api.get('/stats', {
                params: {
                    startDate: dateRange.startDate.toISOString().split('T')[0],
                    endDate: dateRange.endDate.toISOString().split('T')[0]
                }
            });
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [dateRange]);

    return (
        <>
            <PageHeader
                title="Statistics"
                subtitle="Visualize your financial data"
            />

            <Box mt={4}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <IncomeExpenseChart
                            income={stats?.totalIncome || 0}
                            expense={stats?.totalExpense || 0}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <CategoryDistribution
                            data={stats?.expenseByCategory || {}}
                            title="Expense by Category"
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default StatisticsPage;