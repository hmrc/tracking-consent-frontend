module.exports = async (page, scenario, vp) => {
  console.log('SCENARIO > ' + scenario.label);
  if(scenario.enableRebrand) await require('./enableRebrand')(page)
  await require('./clickAndHoverHelper')(page, scenario);
};
