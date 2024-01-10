// Removes message: Jest did not exit one second after the test run has completed.
// Issue with testing on mongoose

module.exports = () => {
  process.exit(0);
};
