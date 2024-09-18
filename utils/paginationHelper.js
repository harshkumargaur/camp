module.exports = async (Model, pageNo) => {
  const skipped = Number(pageNo) === 1 ? 0 : (Number(pageNo) - 1) * 10 - 1;

  const results = await Model.find({}).skip(skipped).limit(10);
  return results;
};
