import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; 
import { Link } from 'react-router-dom'; 
import '../components/Employeelist.css'; 

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/employees'); 
                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                console.error('Error fetching employees:', error);
                alert('An error occurred while fetching employees.');
            }
        };

        fetchEmployees();
    }, []);

    // Filter employees based on the search term
    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to handle employee deletion
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    // Remove the employee from the list
                    setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee._id !== id));
                    alert('Employee deleted successfully.');
                } else {
                    alert('Failed to delete employee.');
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
                alert('An error occurred while deleting the employee.');
            }
        }
    }

    return (
        <div className="employee-list-container">
            <Navbar />
            <h2 className="employee-list-title">Employee List</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <Link to="/create-employee">
                    <button className="create-button">Create Employee</button>
                </Link>
            </div>
            <h3 className="employee-count">Total Employees: {filteredEmployees.length}</h3>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile No</th>
                        <th>Designation</th>
                        <th>Gender</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((employee) => (
                        <tr key={employee._id}>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.mobileNo}</td>
                            <td>{employee.designation}</td>
                            <td>{employee.gender}</td>
                            <td>
                                {employee.imageUrl && (
                                    <img
                                        src={`http://localhost:5000${employee.imageUrl}`}
                                        alt={employee.name}
                                        className="employee-image" // Added class for image
                                    />
                                )}
                            </td>
                            <td className="action-buttons">
                                <Link to={`/edit-employee/${employee._id}`} className="edit-link">Edit</Link>
                                <button className="delete-button" onClick={() => handleDelete(employee._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeList;
