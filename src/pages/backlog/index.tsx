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
  Paper,
} from "@mui/material";

interface Service {
  id: number;
  user: string;
  date: string;
  rating: string[];
}

interface Filter {
  user: string;
  startDate: string;
  endDate: string;
}

export function Backlog() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
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

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const applyFilters = () => {
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
  };

  useEffect(() => {
    applyFilters();
  }, [filter]);

  return (
    <Container>
      <Box component={Paper} padding={2} mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Usuário"
              name="user"
              value={filter.user}
              onChange={handleFilterChange}
              variant="outlined"
            />
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
              <TableCell>Avaliação</TableCell>
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
