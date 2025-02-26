import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TablePagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface User {
  id: number;
  name: string;
  last_name: string;
}

interface Question {
  question: string;
  answer: string;
}

interface Rating {
  id: number;
  questions: Question[];
}

interface Attendant {
  id: number;
  name: string;
  last_name: string;
}

interface Service {
  created_at: string;
  id: number;
  id_attendant: number;
  type: string;
  register: string;
  rating: Rating;
  attendant: Attendant;
}

export function Backlog() {
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedAttendant, setSelectedAttendant] = useState<number | string>(
    ""
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get<{ users: User[] }>(
        "http://172.20.3.79:3000/users"
      );
      setUsers(Array.isArray(response.data.users) ? response.data.users : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get<{ services: Service[] }>(
        "http://172.20.3.79:3000/services"
      );
      setServices(
        Array.isArray(response.data.services) ? response.data.services : []
      );
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchServices();
  }, [fetchUsers, fetchServices]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttendant, startDate, endDate, services]);

  const applyFilters = () => {
    let filtered = services;

    if (selectedAttendant) {
      filtered = filtered.filter(
        (service) => service.id_attendant === selectedAttendant
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (service) => new Date(service.created_at) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (service) => new Date(service.created_at) <= new Date(endDate)
      );
    }

    setFilteredServices(filtered);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedServices = filteredServices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const exportToPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Tipo",
      "Registro",
      "Data de Criação",
      "Atendente",
      "Avaliações",
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tableRows: any[] = [];

    filteredServices.forEach((service) => {
      const serviceData = [
        service.type,
        service.register,
        new Date(service.created_at).toLocaleDateString(),
        service.attendant
          ? `${service.attendant.name} ${service.attendant.last_name}`
          : "No Attendant",
        service.rating && Array.isArray(service.rating.questions)
          ? service.rating.questions
              .map((q) => `Q: ${q.question} A: ${q.answer}`)
              .join("\n")
          : "No Ratings",
      ];
      tableRows.push(serviceData);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      headStyles: { fillColor: [0, 0, 0] },
      margin: { top: 10 },
      styles: { overflow: "linebreak" },
    });

    doc.save("filteredServices.pdf");
  };

  return (
    <Container>
      <Box component={Paper} padding={2} mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="user-select-label">Usuário</InputLabel>
              <Select
                labelId="user-select-label"
                id="user-select"
                name="user"
                label="Usuário"
                value={selectedAttendant}
                onChange={(e) => setSelectedAttendant(e.target.value as number)}
              >
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} {user.last_name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>Nenhum usuário encontrado</em>
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Data Início"
              name="startDate"
              type="date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Data Fim"
              name="endDate"
              type="date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={exportToPDF}
            style={{ marginLeft: "10px" }}
          >
            Exportar para PDF
          </Button>
        </Box>
      </Box>
      <Box component={Paper} padding={2} mb={4}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Registro</TableCell>
                <TableCell>Data de Criação</TableCell>
                <TableCell>Atendente</TableCell>
                <TableCell>Avaliações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedServices.length > 0 ? (
                paginatedServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.type}</TableCell>
                    <TableCell>{service.register}</TableCell>
                    <TableCell>
                      {new Date(service.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {service.attendant
                        ? `${service.attendant.name} ${service.attendant.last_name}`
                        : "No Attendant"}
                    </TableCell>
                    <TableCell>
                      {service.rating &&
                      Array.isArray(service.rating.questions) ? (
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography>Ver Avaliações</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <ul>
                              {service.rating.questions.map(
                                (question, index) => (
                                  <li key={index}>
                                    <strong>Perguntas:</strong>{" "}
                                    {question.question}
                                    <br />
                                    <strong>Respostas:</strong>{" "}
                                    {question.answer}
                                  </li>
                                )
                              )}
                            </ul>
                          </AccordionDetails>
                        </Accordion>
                      ) : (
                        "No Ratings"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Nenhum serviço encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredServices.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Container>
  );
}
