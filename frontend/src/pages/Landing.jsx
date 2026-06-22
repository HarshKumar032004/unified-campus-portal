
import { Link } from 'react-router-dom';
import { FileWarning, MapPin, ScanFace } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] relative overflow-hidden flex flex-col">
      {/* Background Glowing Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <main className="flex-grow relative z-10 flex flex-col items-center pt-20 lg:pt-32">
        
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.h1 
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-7xl mb-6"
          >
            <span className="block text-white mb-2">Unified Campus</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 pb-2">
              Helpdesk Portal
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mt-3 max-w-md mx-auto text-base text-slate-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl leading-relaxed"
          >
            A centralized platform for students to report grievances, apply for digital outpasses, and manage lost & found items. Seamlessly connecting students and administration.
          </motion.p>
          
          <motion.div 
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link
              to="/login"
              className="px-8 py-4 text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-105 md:text-lg md:px-10"
            >
              Student Portal
            </Link>
            <Link
              to="/admin-login"
              className="px-8 py-4 text-base font-medium rounded-xl text-slate-300 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 md:text-lg md:px-10 shadow-xl"
            >
              Staff/Admin Portal
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-24"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {/* Feature 1 */}
            <motion.div 
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-indigo-500/10 text-indigo-400 mx-auto">
                <FileWarning size={32} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white tracking-tight">Grievance Redressal</h3>
              <p className="mt-3 text-base text-slate-400 leading-relaxed">
                Report issues securely. Track status, upvote common complaints, and get transparent remarks from the administration.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-indigo-500/10 text-indigo-400 mx-auto">
                <ScanFace size={32} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white tracking-tight">Digital Outpass</h3>
              <p className="mt-3 text-base text-slate-400 leading-relaxed">
                Apply for hostel leaves instantly. Get digital approvals from wardens without the paper trail.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-indigo-500/10 text-indigo-400 mx-auto">
                <MapPin size={32} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white tracking-tight">Lost & Found</h3>
              <p className="mt-3 text-base text-slate-400 leading-relaxed">
                Did you lose something? Report it here. Found something? Help return it to its rightful owner.
              </p>
            </motion.div>

          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
