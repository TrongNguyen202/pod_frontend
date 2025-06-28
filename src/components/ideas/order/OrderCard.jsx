import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Checkbox,
  IconButton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LayersIcon from '@mui/icons-material/Layers';
import NumbersIcon from '@mui/icons-material/Numbers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { categoryLabelsVi } from 'src/constants';

const OrderCard = ({
  item,
  role,
  isChecked,
  onClick,
  onDelete,
  onToggleCheck,
  showCheckbox,
  canDelete,
  productTypeData,
  handleAmountFormat,
}) => {
  const itemImages = useMemo(() => {
    try {
      return JSON.parse(item.images || '[]');
    } catch {
      return [];
    }
  }, [item.images]);

  return (
    <Paper
      variant="outlined"
      onClick={() => onClick(item)}
      sx={{
        height: 400,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
        overflow: 'hidden',
        borderRadius: 2,
        cursor: 'pointer',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 8px' }}>
        {showCheckbox && (
          <Checkbox checked={isChecked} onClick={(e) => { e.stopPropagation(); onToggleCheck(item.id); }} />
        )}
        {canDelete && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          >
            <Delete sx={{ color: 'red' }} />
          </IconButton>
        )}
      </Box>

      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        <img
          src={itemImages[0] || '/fallback.png'}
          alt={item.title}
          style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover',
          }}
        />
      </Box>

      {itemImages.length > 1 && (
        <Box sx={{ display: 'flex', gap: 0.5, p: 1, overflowX: 'auto', maxHeight: 60, bgcolor: '#fafafa' }}>
          {itemImages.slice(1, 4).map((url, idx) => (
            <Box key={idx} sx={{ width: 50, height: 50, borderRadius: 1, overflow: 'hidden', flexShrink: 0, border: '1px solid #ccc' }}>
              <img src={url} alt={`preview-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ flex: 1, p: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.75rem' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography noWrap variant="body1" fontWeight="bold" color="text.secondary">
            {item.usercreate}
          </Typography>
          <Typography noWrap variant="body2" fontWeight="bold" color="text.secondary">
            {item.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
          <Box>
            <Typography noWrap variant="body3" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarMonthIcon />
              {new Date(item.createddate * 1000).toLocaleDateString('vi-VN')}
            </Typography>
          </Box>
          <Box>
            <Typography noWrap variant="body4" title="Files" sx={{ ml: 1 }}><AttachFileIcon />{itemImages.length}</Typography>
            <Typography noWrap variant="body4" title="Quantity" sx={{ ml: 1 }}><LayersIcon />{item.quantity}</Typography>
            <Typography noWrap variant="body4" title="Number" sx={{ ml: 1 }}><NumbersIcon />{item.number}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
          <Box>
            <Typography noWrap variant="body4">{productTypeData.find((pt) => pt.id === item.producttypeid)?.name}</Typography>
            <Typography noWrap variant="body4" sx={{ ml: 2 }}>{categoryLabelsVi[item.designtype]}</Typography>
          </Box>
          <Typography noWrap variant="body1" fontSize="20px" sx={{ ml: 1 }}>
            {handleAmountFormat(role === 'customer' ? item.price : role === 'designer' ? item.price_ : 0)} đ
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default OrderCard;
