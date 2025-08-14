import { useUser } from '../hooks/useUser';
import { Link } from 'wouter';
import { PackagePlus, Map, ClipboardList, Truck } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import './Dashboard.css';

// Add the ': Variants' type annotation to fix the build error
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100 } 
  },
};

const Dashboard = () => {
  const { data: user } = useUser();

  return (
    <div className="page-container dashboard-container">
      <motion.header 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p>What would you like to do today?</p>
      </motion.header>
      
      <motion.main 
        className="dashboard-grid"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        <Link href="/request-delivery">
          <motion.a className="action-card" variants={cardVariants}>
            <PackagePlus size={40} className="icon" />
            <h2>Request a Delivery</h2>
            <p>Need something picked up and delivered?</p>
          </motion.a>
        </Link>
        <Link href="/find-deliveries">
          <motion.a className="action-card" variants={cardVariants}>
            <Map size={40} className="icon" />
            <h2>Find Deliveries</h2>
            <p>Browse available delivery jobs and earn.</p>
          </motion.a>
        </Link>
        <Link href="/my-requests">
          <motion.a className="action-card" variants={cardVariants}>
            <ClipboardList size={40} className="icon" />
            <h2>My Requests</h2>
            <p>Track the status of your delivery requests.</p>
          </motion.a>
        </Link>
        <Link href="/my-deliveries">
          <motion.a className="action-card" variants={cardVariants}>
            <Truck size={40} className="icon" />
            <h2>My Deliveries</h2>
            <p>Manage the deliveries you have accepted.</p>
          </motion.a>
        </Link>
      </motion.main>
    </div>
  );
};

export default Dashboard;