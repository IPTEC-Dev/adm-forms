import { useState } from "react";
import {
  Box,
  FormControlLabel,
  Typography,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const satisfactionOptions = [
  { value: "muito_satisfeito", label: "Muito satisfeito" },
  { value: "ligeiramente_satisfeito", label: "Ligeiramente satisfeito" },
  { value: "neutro", label: "Neutro" },
  { value: "satisfeito", label: "Satisfeito" },
  { value: "pouco_satisfeito", label: "Pouco satisfeito" },
];

const formSchema = z.object({
  atendimento: z.enum([
    "muito_satisfeito",
    "ligeiramente_satisfeito",
    "neutro",
    "satisfeito",
    "pouco_satisfeito",
  ]),
  tempo: z.enum([
    "muito_satisfeito",
    "ligeiramente_satisfeito",
    "neutro",
    "satisfeito",
    "pouco_satisfeito",
  ]),
  solucao: z.enum([
    "muito_satisfeito",
    "ligeiramente_satisfeito",
    "neutro",
    "satisfeito",
    "pouco_satisfeito",
  ]),
  postura: z.enum([
    "muito_satisfeito",
    "ligeiramente_satisfeito",
    "neutro",
    "satisfeito",
    "pouco_satisfeito",
  ]),
});

type FormData = z.infer<typeof formSchema>;

export function Rating() {
  const { id } = useParams<{ id: string }>();
  const [submitted, setSubmitted] = useState(false);
  const {
    control,
    handleSubmit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const requestData = {
      id_service: Number(id),
      questions: [
        { question: "atendimento", answer: data.atendimento },
        { question: "tempo", answer: data.tempo },
        { question: "solucao", answer: data.solucao },
        { question: "postura", answer: data.postura },
      ],
    };

    try {
      await axios.post("http://172.20.3.79:3000/create-rating", requestData);
      toast.success("Pesquisa enviada com sucesso!");
      setSubmitted(true);
    } catch (error) {
      toast.error("Houve um erro ao enviar a pesquisa!");
    }
  };

  return (
    <>
      <ToastContainer />
      {submitted ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            Corinthians Sport Club agradece sua avaliação
          </Typography>
        </Box>
      ) : (
        <>
          <Box>
            <Typography style={{ textAlign: "center" }} variant="h6">
              Pesquisa de satisfação
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                marginTop: "30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FormControl
                component="fieldset"
                sx={{ width: "100%", maxWidth: 400, marginBottom: 2 }}
              >
                <FormLabel component="legend">
                  1 - Qual foi seu grau de satisfação com o atendimento
                  recebido?
                </FormLabel>
                <Controller
                  name="atendimento"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      {satisfactionOptions.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormControl>
              <FormControl
                component="fieldset"
                sx={{ width: "100%", maxWidth: 400, marginBottom: 2 }}
              >
                <FormLabel component="legend">
                  2 - Em relação ao tempo de atendimento, você se considera?
                </FormLabel>
                <Controller
                  name="tempo"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      {satisfactionOptions.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormControl>
              <FormControl
                component="fieldset"
                sx={{ width: "100%", maxWidth: 400, marginBottom: 2 }}
              >
                <FormLabel component="legend">
                  3 - Em relação a solução apresentada ao seu problema/dúvida,
                  você se considera?
                </FormLabel>
                <Controller
                  name="solucao"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      {satisfactionOptions.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormControl>
              <FormControl
                component="fieldset"
                sx={{ width: "100%", maxWidth: 400, marginBottom: 2 }}
              >
                <FormLabel component="legend">
                  4 - Em relação a postura do atendente você considera?
                </FormLabel>
                <Controller
                  name="postura"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      {satisfactionOptions.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormControl>
              <Button type="submit" variant="contained" color="primary">
                Enviar
              </Button>
            </Box>
          </form>
        </>
      )}
    </>
  );
}
