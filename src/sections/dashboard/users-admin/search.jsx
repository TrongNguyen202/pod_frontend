import { useCallback, useEffect, useState } from 'react';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchGetGroupCustom, fetchGetListUser } from 'src/redux/reducers/user-admin';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { ModalActionUserAdmin } from './modals/modal-action-user';

export const UserAdminListSearch = (props) => {
  const { onSearch } = props;
  const { groupCustoms } = useAppSelector((state) => state.userAdmin);
  const dispatch = useAppDispatch();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  useEffect(() => {
    dispatch(fetchGetGroupCustom());
  }, []);

  const handleSortChange = useCallback((event) => {
    dispatch(fetchGetListUser(event.target.value));
  }, []);

  return (
    <>
      <Stack alignItems="center" direction="row" flexWrap="wrap" spacing={3} sx={{ p: 3, marginTop: 4 }}>
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
        <FormControl>
          <InputLabel id="team">Age</InputLabel>
          <Select onChange={handleSortChange} id={'team'} variant="outlined" label="Team" defaultValue={1}>
            {groupCustoms.map((option) => (
              <MenuItem value={option?.id} key={option?.id}>
                {option?.group_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          startIcon={
            <SvgIcon>
              <PlusIcon />
            </SvgIcon>
          }
          variant="contained"
        >
          Thêm User
        </Button>
      </Stack>
      {isOpenModal && <ModalActionUserAdmin isOpen={isOpenModal} handleClose={handleCloseModal} />}
    </>
  );
};
