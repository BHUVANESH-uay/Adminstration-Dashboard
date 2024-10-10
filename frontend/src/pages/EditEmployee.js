import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../components/EditEmployee.css'; 

const EditEmployee = () => {
    const { email } = useParams(); 
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNo: '',
        designation: '',
        gender: '',
        course: [],
        image: null // Store the image file
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            console.log('Fetching employee with Email:', email); // Log the email being fetched
            try {
                const response = await fetch(`http://localhost:5000/api/employees/email/${email}`); // Adjusted endpoint
                console.log('Response status:', response.status); // Log the response status
                if (!response.ok) {
                    throw new Error('Failed to fetch employee details');
                }
                const data = await response.json();
                setFormData({ ...data, image: null }); 
            } catch (error) {
                console.error('Error fetching employee:', error);
            }
        };

        fetchEmployee();
    }, [email]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCourseChange = (e) => {
        const value = e.target.value;
        setFormData((prevState) => ({
            ...prevState,
            course: prevState.course.includes(value)
                ? prevState.course.filter((course) => course !== value)
                : [...prevState.course, value],
        }));
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] }); // Store the selected file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const response = await fetch(`http://localhost:5000/api/employees/email/${email}`, { // Adjusted endpoint for updating
                method: 'PUT',
                body: data, // Send the FormData
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to update employee.');
                return;
            }
            alert('Employee updated successfully!');
            navigate('/employees');
        } catch (error) {
            console.error('Error updating employee:', error);
            alert('An error occurred while updating the employee.');
        }
    };

    return (
        <div className="edit-employee-container">
            <h2>Edit Employee</h2>
            <form className="edit-employee-form" onSubmit={handleSubmit}>
                <input
                    className="form-input"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    className="form-input"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    className="form-input"
                    name="mobileNo"
                    placeholder="Mobile No"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    required
                />
                <input
                    className="form-input"
                    name="designation"
                    placeholder="Designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                />
                <div className="gender-group">
                    <span className="gender-label">Gender:</span>
                    <input
                        className="form-radio"
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={handleChange}
                        required
                    /> Male
                    <input
                        className="form-radio"
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={handleChange}
                        required
                    /> Female
                </div>
                <div className="course-group">
                    <span className="course-label">Course:</span>
                    <input
                        className="form-checkbox"
                        type="checkbox"
                        value="Course 1"
                        checked={formData.course.includes('Course 1')}
                        onChange={handleCourseChange}
                    /> Course 1
                    <input
                        className="form-checkbox"
                        type="checkbox"
                        value="Course 2"
                        checked={formData.course.includes('Course 2')}
                        onChange={handleCourseChange}
                    /> Course 2
                    <input
                        className="form-checkbox"
                        type="checkbox"
                        value="Course 3"
                        checked={formData.course.includes('Course 3')}
                        onChange={handleCourseChange}
                    /> Course 3
                </div>
                <div>
                    <label>Upload New Image:</label>
                    <input className="form-file" type="file" name="image" onChange={handleFileChange} />
                </div>
                <button className="submit-button" type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditEmployee;
