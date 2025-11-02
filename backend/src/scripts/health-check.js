const mongoose = require('mongoose');
const { ethers } = require('ethers');

const healthCheck = async () => {
  const checks = {
    database: false,
    blockchain: false,
    timestamp: new Date().toISOString(),
  };

  try {
    // Check database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      checks.database = true;
    }
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    // Check blockchain connection
    const provider = new ethers.JsonRpcProvider(
      process.env.AVALANCHE_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc'
    );
    await provider.getBlockNumber();
    checks.blockchain = true;
  } catch (error) {
    console.error('Blockchain health check failed:', error);
  }

  // Determine overall health
  const healthy = checks.database && checks.blockchain;

  if (healthy) {
    console.log('Health check: OK');
    process.exit(0);
  } else {
    console.log('Health check: FAILED', checks);
    process.exit(1);
  }
};

// Run health check
healthCheck();