module.exports = async (page, scenario, vp) => {
  console.log('SCENARIO > ' + scenario.label);
  await require('./fontsHaveLoaded')(page);
  await require('./clickAndHoverHelper')(page, scenario);
};
