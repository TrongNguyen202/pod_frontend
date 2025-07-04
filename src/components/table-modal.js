'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchAllTemplatesByBoardId, fetchDeleteTemplateById } from 'src/redux/reducers/templates';

export default function TableModalDialog({ open, onClose, onSubmit, selectedBoardId }) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [rows, setRows] = useState([{ title: '', description: '' }]);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (selectedBoardId) {
      dispatch(fetchAllTemplatesByBoardId({ boardId: selectedBoardId }));
    }
  }, [dispatch, selectedBoardId]);

  const {
    loading: templatesLoading,
    data: templatesData,
    error: templatesError,
  } = useAppSelector((state) => state.templates.templateInfo);

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];
    if (lastRow.title.trim() === '' && lastRow.description.trim() === '') return;
    setRows((prev) => [...prev, { title: '', description: '' }]);
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleSave = () => {
    onSubmit?.(rows, confirmDeleteId);
    onClose();
  };

  useEffect(() => {
    if (open && selectedBoardId) {
      dispatch(fetchAllTemplatesByBoardId({ boardId: selectedBoardId }));
    }
  }, [open, selectedBoardId]);

  useEffect(() => {
    if (open && templatesData) {
      setRows(templatesData.length > 0 ? templatesData : [{ title: '', description: '' }]);
    }
  }, [open, templatesData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogTitle>{t(tokens.nav.templates)}</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t(tokens.nav.title)}</TableCell>
              <TableCell>{t(tokens.nav.description)}</TableCell>
              <TableCell align="right">{t(tokens.nav.action)}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  {row.id ? (
                    row.title
                  ) : (
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={row.title}
                      onChange={(e) => handleChange(idx, 'title', e.target.value)}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {row.id ? (
                    row.description
                  ) : (
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={row.description}
                      onChange={(e) => handleChange(idx, 'description', e.target.value)}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      setConfirmDeleteIndex(idx);
                      setConfirmDeleteId(row.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button startIcon={<AddIcon />} onClick={handleAddRow} sx={{ mt: 2 }} variant="outlined">
          {t(tokens.nav.addnew)}
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t(tokens.nav.cancel)}</Button>
        <Button variant="contained" onClick={handleSave}>
          {t(tokens.nav.submit)}
        </Button>
      </DialogActions>
      <Dialog open={confirmDeleteIndex !== null} onClose={() => setConfirmDeleteIndex(null)}>
        <DialogTitle>{t(tokens.nav.message_delete)}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteIndex(null)}>{t(tokens.nav.cancel)}</Button>
          <Button
            color="error"
            onClick={async () => {
              try {
                setRows((prev) => prev.filter((_, i) => i !== confirmDeleteIndex));

                if (confirmDeleteId) {
                  await dispatch(fetchDeleteTemplateById({ templateId: confirmDeleteId }));
                  await dispatch(fetchAllTemplatesByBoardId({ boardId: selectedBoardId }));
                }
              } catch (error) {
                console.error('Lỗi xóa:', error);
              } finally {
                setConfirmDeleteIndex(null);
                setConfirmDeleteId(null);
              }
            }}
          >
            {t(tokens.nav.submit)}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
