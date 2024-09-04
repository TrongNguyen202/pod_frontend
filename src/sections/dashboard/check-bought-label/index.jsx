import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { NoData } from 'src/components/nodata';
import { DownloadOutlined } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { RepositoryRemote } from 'src/services';
import { ENVIRONMENT_URL } from 'src/constants';

export const OrderCheckBoughtLabel = () => {
  const [loading, setLoading] = useState(false);
  const [labelSearch, setLabelSearch] = useState([]);
  const [packageId, setPackageId] = useState('');

  const handleDownloadFile = async (fileName) => {
    const toastId = toast.loading('Đang tải label. Vui lòng chờ.');
    try {
      const response = await RepositoryRemote.orders.requestPdfLabelDownload(fileName);
      if (response.data) {
        const url = `${ENVIRONMENT_URL.API_URL}/pdf-download/?filename=${fileName}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
      }
      toast.success('Tải label thành công.', { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.msg || 'Tải label không thành công. Thử lại sau!', { id: toastId });
    }
  };

  const onSearch = async () => {
    setLoading(true);
    try {
      const response = await RepositoryRemote.orders.requestPdfLabelSearch(packageId);
      if (response.data) {
        setLabelSearch(response.data);
      } else {
        setLabelSearch([]);
        toast.error('Không tìm thấy kết quả');
      }
    } catch (error) {
      console.error(error);
      toast.error('Không tìm thấy kết quả');
      setLabelSearch([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <Stack alignItems="center" direction="row" flexWrap="wrap" spacing={30} className="mb-5">
        <Box sx={{ flexGrow: 1 }}>
          <OutlinedInput
            defaultValue=""
            fullWidth
            placeholder="Tìm Kiếm Package ID"
            onChange={(e) => setPackageId(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon>
                  <SearchMdIcon />
                </SvgIcon>
              </InputAdornment>
            }
          />
        </Box>
        <LoadingButton variant="contained" onClick={onSearch} loading={loading} className="!ml-9">
          Tìm kiếm
        </LoadingButton>
      </Stack>

      <Card>
        {labelSearch.length > 0 ? (
          <>
            {labelSearch.map((label) => (
              <Card key={label}>
                <CardHeader
                  title={`Thông tin tìm kiếm  cho [ ${label.replace('.pdf', '')} ]`}
                  action={<DownloadOutlined className="cursor-pointer" onClick={() => handleDownloadFile(label)} />}
                />
                <Divider />
                <CardContent>
                  <Typography variant="h6" className="text-base">
                    Package ID: {label.replace('.pdf', '')}
                  </Typography>
                  <Typography variant="h6">Label file: {label}</Typography>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Box className={'min-h-40 flex items-center justify-center'}>
              <NoData />
            </Box>
          </>
        )}
      </Card>
    </Card>
  );
};
