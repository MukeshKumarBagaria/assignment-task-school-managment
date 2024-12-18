const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent } = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    const { name, className, section, roll } = req.query;
    const students = await getAllStudents({ name, className, section, roll });
    res.json({ students });
});


const handleAddStudent = asyncHandler(async (req, res) => {
    const payload = req.body;
    const message = await addNewStudent(payload);
    res.json(message);
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    // Clean and validate payload
    const updatePayload = {
        ...payload,
        id: Number(id),
        roll: payload.roll ? String(payload.roll) : null, // Ensure roll is a valid string or null
        phone: payload.phone ? String(payload.phone) : null,
        fatherPhone: payload.fatherPhone ? String(payload.fatherPhone) : null,
        motherPhone: payload.motherPhone ? String(payload.motherPhone) : null,
        guardianPhone: payload.guardianPhone ? String(payload.guardianPhone) : null
    };

    // Remove any undefined or null values
    Object.keys(updatePayload).forEach(key => 
        updatePayload[key] === undefined && delete updatePayload[key]
    );

    console.log('Cleaned Update Payload:', updatePayload);

    // Call the service method to update the student
    const result = await updateStudent(updatePayload);

    // Send the response
    res.json({ message: result.message });
});


const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await getStudentDetail(id);
    res.json(student);
 });

 const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    const { status, reviewerId } = req.body;
    const result = await setStudentStatus({ userId, reviewerId, status });
    res.json({ message: result.message });
 });

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
};
