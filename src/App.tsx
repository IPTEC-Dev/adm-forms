import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

export function App() {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
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
              1 - Qual foi seu grau de satisfação com o atendimento recebido?
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
              3 - Em relação a solução apresentada ao seu problema/dúvida, você
              se considera?
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
  );
}
