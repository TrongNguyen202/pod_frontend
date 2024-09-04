import { Box, Card, FormControl, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import FileUpload from 'src/components/file-upload';

export const ProductMedia = ({ control }) => {
  return (
    <Card className="p-6 mt-5">
      <Typography variant="h6" className="pb-3">
        Ảnh và video
      </Typography>
      <FormControl fullWidth margin="normal">
        <Box display="flex" flexDirection="column">
          <Controller name="images" control={control} render={({ field }) => <FileUpload field={field} />} />
        </Box>
      </FormControl>
      <Typography variant="h6" className="pb-3">
        Ảnh size chart
      </Typography>
      <Box display="flex" flexDirection="column">
        <Controller name="size_chart" control={control} render={({ field }) => <FileUpload field={field} />} />
      </Box>
    </Card>
  );
};
