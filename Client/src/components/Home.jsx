import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp, FiUsers, FiGlobe, FiZap } from 'react-icons/fi';
import { Helmet } from 'react-helmet';
import heroImage from '../assets/image-removebg-preview (4).png';

const Home = () => {
  const [activeFeature, setActiveFeature] = React.useState(0);

  // Features data
  const features = [
    {
      title: "Decentralized Funding",
      description: "Leverage blockchain technology for transparent, secure crowdfunding",
      icon: <FiTrendingUp className="w-6 h-6" />
    },
    {
      title: "Global Community",
      description: "Connect with backers from around the world",
      icon: <FiGlobe className="w-6 h-6" />
    },
    {
      title: "Instant Transactions",
      description: "Fast, low-cost payments with cryptocurrency",
      icon: <FiZap className="w-6 h-6" />
    },
    {
      title: "Community Driven",
      description: "Projects backed by real people, not algorithms",
      icon: <FiUsers className="w-6 h-6" />
    }
  ];

  // Stats data
  const stats = [
    { value: "10,000+", label: "Projects Funded" },
    { value: "$50M+", label: "Raised" },
    { value: "200+", label: "Countries" },
    { value: "98%", label: "Success Rate" }
  ];

  return (
    <>
      <Helmet>
        <title>CrowdFundX | Decentralized Crowdfunding Platform</title>
        <meta name="description" content="Launch and support innovative projects with blockchain-powered crowdfunding. Transparent, secure, and community-driven." />
        <meta property="og:title" content="CrowdFundX | Decentralized Crowdfunding" />
        <meta property="og:description" content="The future of crowdfunding powered by blockchain technology" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="keywords" content="crowdfunding, blockchain, ethereum, crypto, fundraising, decentralized" />
      </Helmet>

      {/* Hero Section - Now Full Screen */}
      <section className="relative bg-gradient-to-br from-indigo-900 to-blue-800 text-white overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white"
                  >
                    The Future of
                  </motion.span>
                  <br />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300"
                  >
                    Crowdfunding
                  </motion.span>
                </h1>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="text-xl md:text-2xl lg:text-3xl text-blue-100 mb-10"
              >
                Launch and support innovative projects with blockchain-powered transparency
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/explore"
                    className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg lg:text-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition"
                  >
                    Explore Projects <FiArrowRight />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/create"
                    className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg lg:text-xl flex items-center justify-center gap-2 hover:bg-white/5 transition"
                  >
                    Start a Campaign
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 1,
                ease: "easeOut",
                delay: 0.5
              }}
              className="hidden md:block relative"
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-10"
              >
                <img
                  src={heroImage}
                  alt="Crowdfunding Hero"
                  className="w-full h-auto max-w-lg mx-auto filter drop-shadow-2xl"
                />
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md aspect-square rounded-full bg-blue-500/20 blur-3xl"
              />
            </motion.div>
          </div>
        </div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-400 rounded-full filter blur-3xl opacity-20"
        />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y:20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-indigo-600">CrowdFundX</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The most transparent and secure way to fund your ideas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onHoverStart={() => setActiveFeature(index)}
                  className={`p-6 rounded-xl cursor-default transition-all ${activeFeature === index ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${activeFeature === index ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative w-full max-w-md aspect-square"
              >
                <div className="absolute inset-0 bg-indigo-500 rounded-3xl opacity-10" />
                <div className="absolute inset-4 bg-indigo-400 rounded-2xl opacity-20" />
                <div className="absolute inset-8 bg-indigo-300 rounded-xl opacity-30" />
                <div className="absolute inset-12 bg-indigo-200 rounded-lg opacity-40" />
                <div className="absolute inset-16 bg-indigo-100 rounded-md opacity-50" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6"
              >
                <p className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">{stat.value}</p>
                <p className="text-lg text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to change the world?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              Join thousands of creators and backers in the decentralized crowdfunding revolution
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/create"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-white/5 transition"
                >
                  Start Your Campaign
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/explore"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-white/5 transition"
                >
                  Explore Projects
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;