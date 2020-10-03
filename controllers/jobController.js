const { Job } = require("../models/job");

exports.getAllJobs = async (request, response) => {
	try {
		const jobList = await Job.find({}, { _id: 0 });

		const count = await Job.countDocuments();

		response
			.status(200)
			.json({
				status: "success",
				data: jobList,
				total: count
			})
			.send(jobList);
	} catch (error) {
		return response.status(400).json({
			status: "Fail",
			message: error
		});
	}
};
