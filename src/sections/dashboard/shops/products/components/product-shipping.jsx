import { Card, Grid, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

export const ProductShipping = (props) => {
  const { control, errors, shopId } = props;

  return (
    <Card className="p-6 my-6">
      <Typography variant="h6" className="pb-3">
        Thông tin vận chuyển
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Controller
            name="package_weight"
            control={control}
            // rules={{ required: "Cân nặng không được để trống." }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Cân nặng"
                fullWidth
                margin="normal"
                endAdornment={"pound"}
              />
            )}
            // error={!!errors.package_weight}
            // helperText={
            //   errors.package_weight ? errors.package_weight.message : ""
            // }
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Controller
            name="package_width"
            control={control}
            // rules={{ required: "Chiều rộng không được để trống." }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Chiều rộng"
                fullWidth
                margin="normal"
              />
            )}
            // error={!!errors.package_width}
            // helperText={
            //   errors.package_width ? errors.package_width.message : ""
            // }
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Controller
            name="package_height"
            control={control}
            // rules={{ required: "Chiều dài không được để trống." }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Chiều dài"
                fullWidth
                margin="normal"
              />
            )}
            // error={!!errors.package_height}
            // helperText={
            //   errors.package_height ? errors.package_height.message : ""
            // }
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Controller
            name="package_length"
            control={control}
            // rules={{ required: "Chiều cao không được để trống." }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Chiều cao"
                fullWidth
                margin="normal"
              />
            )}
            // error={!!errors.package_length}
            // helperText={
            //   errors.package_length ? errors.package_length.message : ""
            // }
          />
        </Grid>
      </Grid>
    </Card>
  );
};
