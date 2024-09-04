import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { Button } from '@mui/material';
import { useState } from 'react';
import { ModalActionUser } from './modals/modal-action-user';

export const UserSearch = (props) => {
  const { onSearch } = props;
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      <Stack alignItems="center" direction="row" flexWrap="wrap" spacing={30} sx={{ p: 3 }}>
        <Box component="form" onSubmit={() => {}} sx={{ flexGrow: 1 }}>
          <OutlinedInput
            defaultValue=""
            fullWidth
            placeholder="Tìm Kiếm User"
            onChange={(e, value) => onSearch(e)}
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon>
                  <SearchMdIcon />
                </SvgIcon>
              </InputAdornment>
            }
          />
        </Box>
        <Button
          startIcon={
            <SvgIcon>
              <PlusIcon />
            </SvgIcon>
          }
          variant="contained"
          onClick={() => setIsOpenModal(true)}
        >
          Thêm user
        </Button>
      </Stack>
      {isOpenModal && <ModalActionUser isOpen={isOpenModal} handleClose={handleCloseModal} />}
    </>
  );
};
