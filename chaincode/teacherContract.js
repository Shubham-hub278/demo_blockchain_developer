use strict';

const {Contract} = require('fabric-contract-api');
const ClientIdentity = require("fabric-shim").ClientIdentity;

class teacherContract extends Contract {

	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.learning-network.learnnet.teachers');
	}

	/* ****** All custom functions are defined below ***** */

	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('Teacher Smart Contract Instantiated');
	}


  /**
   * Receive new Teacher registeration request
   * @param ctx - The transaction context object
   * @param name - Name of the user
   * @param course- Subjet matter related to the teacher
   * @returns {user Object}
   **/

  async registerTeacher(ctx, name, id, course) {

    // composite key for accessing teacher object
    let RequestKey = ctx.stub.createCompositeKey('org.learning-network.learnnet.teachers',[name, id]);

		// Create a Teacher object to be stored in blockchain
	let newTeacherObject = {
		TeacherId: id,
		name: name,
		course: course,
		createdAt: new Date(),
		flag: 'Registered',
	};
			// Convert the JSON object to a buffer and send it to blockchain for storage
			let dataBuffer = Buffer.from(JSON.stringify(newTeacherObject));
			await ctx.stub.putState(RequestKey, dataBuffer);
			// Return value of updated user object with approved status
			return newTeacherObject;
	}

	/**
	 * Set Online test by a teacher
	 * @param ctx - The transaction context object
	 * @param Testid - Test Identifier
	 * @param QuestionHash- Storage Hash of ALL MCQs
	 * @param rightanswers- array variable storing correct answer option of each question in order
	 * @returns {Test Object}
	 **/

		async setOnlineTest(ctx, Testid,NumberofQuestions, QuestionHash,...rightanswers) {

			let cid = new ClientIdentity(ctx.stub);
			let mspID = cid.getMSPID();
			let msgSender = ctx.clientIdentity.getID();

		 if ("teacherMSP" === mspID) {
	    // composite key for test object
	    let TestKey = ctx.stub.createCompositeKey('org.learning-network.learnnet.tests',[Testid]);

		// Fetch test with given ID from blockchain
			let testObject = await ctx.stub
				.getState(certificateKey)
				.catch(err => console.log(err));
		// Make sure that the test with given ID does not exist.
			if (testObject.length !== 0) {
			throw new Error('Test is not ceated yet.');
			} else {
			let test = {
				testId: Testid,
				teacher: msgSender,
				NumberofQuestions: NumberofQuestions,
				questionHash: Questionhash,
				createdAt: new Date(),
				rightanswers: rightanswers,
				updatedAt: new Date(),
			};
			// Convert the JSON object to a buffer and send it to blockchain for storage
			let dataBuffer = Buffer.from(JSON.stringify(test));
			await ctx.stub.putState(TestKey, dataBuffer);
			// Return value of new Test
			return test;
		}
	}
		else { console.log("You do not have access to create the test");}
}


		/**
	 * Calculate score of the student after completing the test
	 * @param ctx
	 * @param studentId
	 * @param testId
	 * @returns {Object}
	 */
	async calculateScore(ctx, studentId, testId) {

		let cid = new ClientIdentity(ctx.stub);
		let mspID = cid.getMSPID();
		let msgSender = ctx.clientIdentity.getID();

		let TestKey = ctx.stub.createCompositeKey('org.learning-network.learnnet.tests',[testId]);

	// Fetch test with given ID from blockchain
		let testObject = await ctx.stub
			.getState(TestKey)
			.catch(err => console.log(err));
            //getting retailer composite key

		let studentKey = ctx.stub.createCompositeKey('org.learning-network.learnnet.students', [studentId]);

		// Fetch student with given ID from blockchain
		let studentbuffer = await ctx.stub
				.getState(studentKey)
				.catch(err => console.log(err));

		// Make sure that student already exists and test with given ID doe exist.
		if (studentbuffer.length === 0 || testObject.length !== 0) {
			throw new Error('Invalid student ID: ' + studentId + ' or Test ID: ' + testId + '. Either student or the test does not exist.');
		} else {

			let test=JSON.parse(testObject.toString());

			let student=JSON.parse(studentbuffer.toString());

			//Only teacher who framed the test can access student responses of the test

			if(mspID==='teacherMSP' && test.teacher===msgSender){

				let responseKey = ctx.stub.createCompositeKey('org.learning-network.learnnet.responses', [studentId, testId]);

				let responsebuffer = await ctx.stub
						.getState(responseKey)
						.catch(err => console.log(err));

						//check whether response object exists or not
				if(responsebuffer){
					let responses=JSON.parse(responsebuffer.toString());

         let counter=0;

				 for(let questionId=0;i<test.NumberofQuestions;questionId++){

					 if(responses[i]===test.rightanswers[i{]){
						 counter++;
					 }
				 }

				 if(counter>(responses.length)/2)){
				 student.learntoken+=student.learntoken*0.5;
				 student.updatedAt=new Date();
			 }
			// Convert the JSON object to a buffer and send it to blockchain for storage
				let dataBuffer = Buffer.from(JSON.stringify(student));
				await ctx.stub.putState(studentbuffer, dataBuffer);
			// Return updated student Object
				return student;
		}
			else {console.log(" Student has not taken the Online test yet");
			}
		}
	}
}

}
module.exports = teacherContract;
