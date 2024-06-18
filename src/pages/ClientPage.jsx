import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '../styles/Container.jsx'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            paper: '#333',
        },
        text: {
            primary: '#ffffff',
        },
    },
});

const columns = [
    { id: 'accountNumber', label: 'Account Number', minWidth: 170 },
    { id: 'surname', label: 'Surname', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'patronymic', label: 'Patronymic', minWidth: 100 },
    { id: 'birthDate', label: 'Birth Date', minWidth: 100 },
    { id: 'inn', label: 'INN', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'updateStatus', label: 'Update Status', minWidth: 170 },
];

const ClientPage = () => {
    const [clients, setClients] = useState([]);
    const [status, setStatus] = useState({});
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        axios
            .get("http://localhost:5001/api/clients", { withCredentials: true })
            .then((response) => {
                setClients(response.data);
            })
            .catch((error) => {
                setError("Failed to fetch clients");
            });
    }, []);

    const handleStatusChange = (clientId, newStatus) => {
        setStatus((prevStatus) => ({ ...prevStatus, [clientId]: newStatus }));
    };

    const handleSubmit = (clientId) => {
        axios
            .post(
                "http://localhost:5001/api/clients/status",
                {
                    clientId,
                    status: status[clientId],
                },
                { withCredentials: true },
            )
            .then(() => {
                const updatedClients = clients.map((client) =>
                    client._id === clientId
                        ? { ...client, status: status[client._id] }
                        : client,
                );
                setClients(updatedClients);
            })
            .catch(() => {
                setError("Failed to update status");
            });
    };

    const handleLogout = () => {
        axios
            .post("http://localhost:5001/api/auth/logout", {}, { withCredentials: true })
            .then(() => window.location.reload())
            .catch(() => {
                setError("Failed to logout");
            });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Container>


            <Paper sx={{ width: '80%', overflow: 'hidden', backgroundColor: 'background.paper', color: 'text.primary', padding: '10px'}}>
                <h1>Clients</h1>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clients
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((client) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={client._id}>
                                        <TableCell>{client.accountNumber}</TableCell>
                                        <TableCell>{client.surname}</TableCell>
                                        <TableCell>{client.name}</TableCell>
                                        <TableCell>{client.patronymic}</TableCell>
                                        <TableCell>{new Date(client.birthDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{client.inn}</TableCell>
                                        <TableCell>{client.status}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={status[client._id] || client.status}
                                                onChange={(e) => handleStatusChange(client._id, e.target.value)}
                                            >
                                                <MenuItem value="Не в работе">Не в работе</MenuItem>
                                                <MenuItem value="В работе">В работе</MenuItem>
                                                <MenuItem value="Отказ">Отказ</MenuItem>
                                                <MenuItem value="Сделка закрыта">Сделка закрыта</MenuItem>
                                            </Select>
                                            <Button sx={{margin: '10px', backgroundColor: 'background.paper', color: 'text.primary'}} onClick={() => handleSubmit(client._id)}>Update</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={clients.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Button sx={{margin: '10px', backgroundColor: 'background.paper', color: 'text.primary'}} onClick={handleLogout}>Logout</Button>
            </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default ClientPage;
