import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useCallback, useEffect } from "react";

type FormValues = {
  type: string;
  register: string;
};

type Service = {
  id: number;
  // Adicione outros campos relevantes de serviços aqui
};

type UserData = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  services: Service[];
};

export function Home() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://172.20.3.79:3000/user/${userId}`
      );
      setUserData(response.data.user);
    } catch (error) {
      toast.error("Houve um erro ao buscar os atendimentos!");
    }
  }, [userId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await axios.post(
        "http://172.20.3.79:3000/create-service",
        {
          type: data.type,
          register: data.register,
          id_attendant: Number(userId), // Inclui o ID do usuário logado como id_attendant
        }
      );
      setServiceId(response.data.service.id);
      toast.success("Atendimento enviado com sucesso!");
      fetchServices(); // Re-fetch services after form submission
    } catch (error) {
      toast.error("Houve um erro ao enviar o atendimento!");
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <ToastContainer />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: 4,
        }}
      >
        {userData && (
          <>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: "bold", textAlign: "center", mt: 2 }}
            >
              {userData.name} {userData.last_name}
            </Typography>
            <Typography
              variant="h6"
              component="h3"
              sx={{ fontWeight: "bold", textAlign: "center", mt: 2 }}
            >
              Número de atendimentos: {userData.services?.length || 0}
            </Typography>
          </>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            padding: 4,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <AssignmentOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Atendimento
          </Typography>
          {serviceId ? (
            <>
              <Typography
                variant="h6"
                color="textSecondary"
                sx={{ mt: 2, textAlign: "center", fontWeight: "bold" }}
              >
                Informe esse número de atendimento ao usuário para que ele possa
                avaliá-lo:
              </Typography>
              <Typography
                variant="h4"
                color="textSecondary"
                sx={{ mt: 2, textAlign: "center", fontWeight: "bold" }}
              >
                Número de atendimento: {serviceId}
              </Typography>
              <Button
                onClick={() => {
                  setServiceId(null);
                  navigate("/home");
                }}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Retornar
              </Button>
            </>
          ) : (
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="type"
                label="Tipo de Atendimento"
                autoFocus
                {...register("type", { required: "Tipo é obrigatório" })}
                error={!!errors.type}
                helperText={errors.type?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="register"
                label="Registro"
                {...register("register", {
                  required: "Registro é obrigatório",
                })}
                error={!!errors.register}
                helperText={errors.register?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Enviar
              </Button>
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
