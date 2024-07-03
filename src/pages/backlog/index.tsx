// src/pages/backlog.tsx
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
} from "@mui/material";

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

interface Service {
  created_at: string;
  id: number;
  id_attendant: number;
  type: string;
  register: string;
  rating: Rating;
}

export function Backlog() {
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get<{ users: User[] }>(
        "http://localhost:3001/users"
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
        "http://localhost:3001/services"
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

  console.log(services);

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
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button variant="contained" color="primary">
            Aplicar Filtros
          </Button>
        </Box>
      </Box>
      <Box component={Paper} padding={2} mb={4}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Registro</TableCell>
                <TableCell>Data de Criação</TableCell>
                <TableCell>Atendente</TableCell>
                <TableCell>Avaliações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.length > 0 ? (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.id}</TableCell>
                    <TableCell>{service.type}</TableCell>
                    <TableCell>{service.register}</TableCell>
                    <TableCell>
                      {new Date(service.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{service.id_attendant}</TableCell>
                    <TableCell>
                      {service.rating &&
                      Array.isArray(service.rating.questions) ? (
                        <ul>
                          {service.rating.questions.map((question, index) => (
                            <li key={index}>
                              <strong>Pergunta:</strong> {question.question}
                              <br />
                              <strong>Resposta:</strong> {question.answer}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No Ratings"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum serviço encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
