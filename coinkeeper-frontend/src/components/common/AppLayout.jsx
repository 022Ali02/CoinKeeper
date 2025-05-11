import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';

const Main = styled('main')(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
    })
}));

const drawerWidth = 240;

const AppLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            <Main open={sidebarOpen}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ paddingTop: '80px' }}
                >
                    {children}
                </motion.div>
            </Main>
        </Box>
    );
};

export default AppLayout;