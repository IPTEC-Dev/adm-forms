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
} from "@mui/material";

interface User {
  id: number;
  name: string;
  last_name: string;
}

export function Backlog() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get<{ users: User[] }>(
        "http://localhost:3001/users"
      );
      setUsers(Array.isArray(response.data.users) ? response.data.users : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]); // Handle error by setting users to an empty array
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
    </Container>
  );
}
