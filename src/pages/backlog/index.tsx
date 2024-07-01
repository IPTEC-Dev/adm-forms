// src/pages/backlog.tsx
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  Box,
  Button,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

interface Service {
  id: number;
  user: string;
  date: string;
  rating: number;
}

interface User {
  id: string;
  name: string;
}

interface Filter {
  user: string;
  startDate: string;
  endDate: string;
}

export function Backlog() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<Filter>({
    user: "",
    startDate: "",
    endDate: "",
  });

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get<Service[]>("/get-services");
      setServices(response.data || []);
      setFilteredServices(response.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get<User[]>("/get-users");
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    fetchUsers();
  }, [fetchServices, fetchUsers]);

  const handleFilterChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name as string]: value as string,
    }));
  };

  const applyFilters = useCallback(() => {
    let filtered = services;

    if (filter.user) {
      filtered = filtered.filter((service) =>
        service.user.includes(filter.user)
      );
    }

    if (filter.startDate) {
      filtered = filtered.filter(
        (service) => new Date(service.date) >= new Date(filter.startDate)
      );
    }

    if (filter.endDate) {
      filtered = filtered.filter(
        (service) => new Date(service.date) <= new Date(filter.endDate)
      );
    }

    setFilteredServices(filtered);
  }, [filter, services]);

  useEffect(() => {
    applyFilters();
  }, [filter, applyFilters]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Backlog
      </Typography>

      <Box component={Paper} padding={2} mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="user-select-label">Usuário</InputLabel>
              <Select
                labelId="user-select-label"
                id="user-select"
                name="user"
                value={filter.user}
                onChange={handleFilterChange}
                label="Usuário"
              >
                <MenuItem value="">
                  <em>Nenhum</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.name}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Data Início"
              name="startDate"
              type="date"
              value={filter.startDate}
              onChange={handleFilterChange}
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
              value={filter.endDate}
              onChange={handleFilterChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={applyFilters}>
            Aplicar Filtros
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuário</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(filteredServices) ? (
              filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.user}</TableCell>
                  <TableCell>
                    {format(new Date(service.date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{service.rating}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>Nenhum serviço encontrado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
