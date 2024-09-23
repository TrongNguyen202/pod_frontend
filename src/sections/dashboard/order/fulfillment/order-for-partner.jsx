import { LinkOutlined } from '@mui/icons-material';
import { Box, Button, Card, Divider, MenuItem, Select, Typography } from '@mui/material';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchGetDesignSku, fetchPackageFulfillmentCompleted, fetchToShipInfor } from 'src/redux/reducers/orders';
import { TableOrderFlashShip } from './table/table-order-flashship';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { fetchGetFlashShipPODVariant } from 'src/redux/reducers/flash-ship';
import { useSelection } from 'src/hooks/use-selection';
import { TableOrderPrintCare } from './table/table-order-printcare';
import { RepositoryRemote } from 'src/services';
import * as XLSX from 'xlsx';

export const OrderCheckPartner = ({ toShipInfoData }) => {
  const dispatch = useAppDispatch();
  const [showLink, setShowLink] = useState(false);
  const [flashShipShipment, setFlashShipShipment] = useState(1);
  const [designSkuById, setDesignSkuById] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataOCRCheck, setDataOCRCheck] = useState([]);
  const [flashShipTable, setFlashShipTable] = useState([]);
  const [printCareTable, setPrintCareTable] = useState([]);
  const [openLoginFlashShip, setOpenLoginFlashShip] = useState(false);
  const [allowCreateOrderPartner, setAllowCreateOrderPartner] = useState(false);
  const [loadingTableFlashShip, setLoadingTableFlashShip] = useState(false);
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');

  const { designSku, toShipInfor, packageFulfillmentCompleted } = useAppSelector((state) => state.orders);
  const { PODVariant } = useAppSelector((state) => state.flashShip);

  const orderIds = useMemo(() => {
    return flashShipTable.map((ship) => ship.order_id);
  }, [flashShipTable]);

  const orderIdsPrinterCare = useMemo(() => {
    return printCareTable.map((ship) => ship.order_id);
  }, [printCareTable]);

  const ordersSelection = useSelection(orderIds);
  const ordersSelectionPrintCare = useSelection(orderIdsPrinterCare);

  const handleCreateOrderFlashShip = async () => {};

  const checkDataPartner = (data) => {
    // console.log("da cos data")
    const dataCheck = data
      .map((order) => {
        // order.order_list[0].item_list = order.order_list[0].item_list.filter((item) => item.sku_name !== 'Default');
        return order;
      })
      .filter((order) => order.order_list[0].item_list.length > 0);

    const orderPartnerResult = dataCheck?.map((dataItem) => {
      const orderPartner = { ...dataItem };
      const itemList = dataItem?.order_list?.flatMap((item) => item.item_list);
      const itemListRemovePhysical = itemList.filter((item) => item.sku_name !== 'Default');
      let isFlashShip = true;
      const variations = itemListRemovePhysical.map((variation) => {
        if (!isFlashShip) return variation;
        let variationObject = {};
        const result = { ...variation };
        const variationSplit = variation?.sku_name.split(',').map((item) => item.trim());

        if (variationSplit.length === 3) {
          variationObject = {
            color: variationSplit[0],
            size: variationSplit[1] - variationSplit[2],
          };
        } else {
          variationObject = {
            color: variationSplit[0],
            size: variationSplit[1],
          };
        }

        if (variationObject.length < 2) {
          isFlashShip = false;
        } else {
          const variationObjectSize = 
  typeof variationObject?.size === 'string' 
  ? variationObject.size.split(/[\s-,]/).filter(Boolean) 
  : [];

          const checkProductType = PODVariant.data?.filter((variant) =>
            variationObjectSize.find((item) => item.toUpperCase() === variant.product_type.toUpperCase()),
          );

          if (!checkProductType.length) {
            isFlashShip = false;
          }

          if (checkProductType.length) {
            const checkColor = checkProductType.filter(
              (color) => color.color.toUpperCase() === variationObject?.color?.replace(' ', '').toUpperCase(),
            );

            if (checkColor.length) {
              const checkSize = checkColor.find((size) => {
                return variationObjectSize.find((item) => item.toUpperCase() === size.size.toUpperCase());
              });

              if (checkSize) {
                result.variant_id = checkSize.variant_id;
              } else {
                isFlashShip = false;
              }
            } else {
              isFlashShip = false;
            }
          }
        }

        return result;
      });

      orderPartner.buyer_email = dataItem.order_list[0].buyer_email;
      orderPartner.order_list = variations;
      orderPartner.is_FlashShip = isFlashShip;
      orderPartner.order_id = dataItem.order_list
        .map((item, index) => (index !== 0 ? `-${item.order_id}` : item.order_id))
        .join('');
      return orderPartner;
    });

    const dataFlashShip = orderPartnerResult?.filter((item) => item.is_FlashShip);
    const dataPrintCare = orderPartnerResult?.filter((item) => !item.is_FlashShip);
    console.log("data flashship", dataPrintCare)
    if (dataFlashShip.length) setFlashShipTable(dataFlashShip);
    if (dataPrintCare.length) setPrintCareTable(dataPrintCare);
  };

  const handleDataOCRCheck = () => {
    if (toShipInfor?.data?.length) {
      let errorShown = false;
      const dataCheck = toShipInfor.data.map((item) => {
        setAllowCreateOrderPartner(true);
        if (item.data.status === 'error' && !errorShown) {
          toast.error(item.data?.message || 'Đã có lỗi sảy ra!');
          errorShown = true;
          setAllowCreateOrderPartner(false);
        }

        const itemLabel = toShipInfoData.find(
          (itemShipInfo) => itemShipInfo.package_id === item.data.data.order_list[0].package_list[0].package_id,
        );

        return {
          label: itemLabel?.label,
          order_list: item?.data?.data?.order_list,
          package_id: item?.data?.data?.order_list[0]?.package_list[0]?.package_id,
          state: item?.data?.ocr_result?.data?.state,
          street: item?.data?.ocr_result?.data?.address || '',
          city: item?.data?.ocr_result?.data?.city || '',
          tracking_id: item?.data?.ocr_result.data?.tracking_id || '',
          zip_code: item?.data?.ocr_result?.data?.zipcode || '',
          name_buyer: item?.data?.ocr_result?.data?.name || '',
        };
      });
      setDataOCRCheck(dataCheck);
    }
  };

  useEffect(() => {
    handleDataOCRCheck();
  }, [toShipInfor.data]);

  useEffect(() => {
    if (dataOCRCheck && PODVariant.data.length > 0) {
      checkDataPartner(dataOCRCheck);
    }
  }, [dataOCRCheck, PODVariant.data]);

  useEffect(() => {
    if (shopId) {
      const dataConvert = toShipInfoData.map((data) => {
        return {
          ...data,
          order_list: data.order_list.map((order) => {
            return {
              ...order,
              order_id: order?.id,
            };
          }),
        };
      });

      const data = {
        order_documents: dataConvert,
      };

      dispatch(fetchGetDesignSku());
      dispatch(fetchGetFlashShipPODVariant());
      dispatch(fetchToShipInfor({ shopId: shopId, body: data }));
      dispatch(fetchPackageFulfillmentCompleted(shopId));
    }
  }, [toShipInfoData, shopId]);

  const handAddDesignToShipInfoData = (data) => {
    return data.map((item) => {
      const orderItem = item.order_list.map((order) => {
        const design = designSku?.data?.results?.find((skuItem) => skuItem.sku_id === order.sku_id);
        if (design) {
          return {
            ...order,
            image_design_front: design.image_front,
            image_design_back: design.image_back,
            mockup_front:design.mockup_front,
            mockup_back:design.mockup_back,
          };
        }
        return order;
      });

      return {
        ...item,
        order_list: orderItem,
      };
    });
  };

  const handleConvertDataPackageCreate = (data, key, isExport) => {
    const result = data
      .map((item) => {
        let orderList;
        const orderFulfillmentCompletedRejected = packageFulfillmentCompleted.data.find(
          (order) => order.order_id === item.order_id,
        );

        if (isExport) {
          orderList = item.order_list.map((order) => {
            const orderItem = {
              pack_id: item.package_id,
              order_id: item.order_id,
              buyer_first_name: item.name_buyer?.split(' ')[0] || '',
              buyer_last_name: item.name_buyer?.split(' ')[1] || '',
              buyer_email: item.buyer_email,
              buyer_phone: '',
              buyer_address1: item.street?.trim(),
              buyer_address2: '',
              buyer_city: item.city,
              buyer_province_code: item.state?.trim(),
              buyer_zip: item.zip_code,
              buyer_country_code: 'US',
              shipment: flashShipShipment,
              linkLabel: item.label,
              products: [
                {
                  variant_id: key === 'PrintCare' ? 'POD097' : order.variant_id,
                  printer_design_front_url: order?.image_design_front || null,
                  printer_design_back_url: order?.image_design_back || null,
                  quantity: order.quantity,
                  note: '',
                },
              ],
            };
            return orderItem;
          });
        } else {
          orderList = {
            pack_id: item.package_id,
            order_id: item.order_id,
            buyer_first_name: item.name_buyer?.split(' ')[0] || '',
            buyer_last_name: item.name_buyer?.split(' ')[1] || '',
            buyer_email: item.buyer_email,
            buyer_phone: '',
            buyer_address1: item.street?.trim(),
            buyer_address2: '',
            buyer_city: item.city,
            buyer_province_code: item.state?.trim(),
            buyer_zip: item.zip_code,
            buyer_country_code: 'US',
            shipment: flashShipShipment,
            linkLabel: item.label,
            products: item.order_list.map((product) => ({
              variant_id: key === 'PrintCare' ? 'POD097' : product.variant_id,
              printer_design_front_url: product?.image_design_front || null,
              printer_design_back_url: product?.image_design_back || null,
              quantity: product?.quantity,
              note: '',
            })),
          };
        }

        if (orderFulfillmentCompletedRejected && orderFulfillmentCompletedRejected?.package_status === false) {
          orderList.order_id = `${item.order_id}-${Math.floor(Math.random() * 10)}`;
        }
        return orderList;
      })
      .flat();
    return result;
  };

  const ExportExcelFile = async (data, fileName, dataPackageCreate) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}-${Date.now()}.xlsx`);

    const dataPackageCreateConvert = handleConvertDataPackageCreate(dataPackageCreate, fileName, true);

    const promise = dataPackageCreateConvert.map(async (item) => {
      if (fileName === 'PrintCare') {
        await RepositoryRemote.orders.requestPackageCreatePrintCare(shopId, item);
      } else {
        await RepositoryRemote.orders.requestPackageCreateFlashShip(shopId, item);
      }
    });

    Promise.all(promise).then(() => {
      toast.success('Export đơn thành công.');
      setShowLink(true);
    });
  };

  const handleExportExcelFile = async (data, key) => {
    try {
      setLoadingTableFlashShip(true);
      const dataFind = (key === 'FlashShip' ? flashShipTable : printCareTable).filter((ship) =>
        data.includes(ship?.order_id),
      );

      const dataLabel = {
        pdf_name: dataFind.map((item) => `${item.package_id}.pdf`),
      };

      const response = await RepositoryRemote.orders.requestPdfLabelLinkSearch(dataLabel);

      if (response.data) {
        const dataChangedLabelLink = dataFind.map((item) => {
          const resConvert = response.data.flatMap((resItem) => resItem[0]);
          const checkPackageId = resConvert.find(
            (itemRes) => itemRes.name.replace('.pdf', '').toString() === item.package_id,
          );
          return {
            ...item,
            label: checkPackageId.link,
          };
        });

        const dataConvert = handAddDesignToShipInfoData(dataChangedLabelLink);

        const productItem = dataConvert
          .map((item) => {
            const productItem = item.order_list.map((product) => ({
              ...product,
              city: item.city,
              buyer_email: item.buyer_email,
              name_buyer: item.name_buyer,
              package_id: item.package_id,
              order_id: item.order_id,
              state: item.state,
              street: item.street,
              tracking_id: item.tracking_id,
              zip_code: item.zip_code,
              label: item.label,
            }));

            return productItem;
          })
          .flat();

        const dataExport = productItem.map((product) => {
          const result = {
            'External ID': 'POD196',
            'Order ID': product.order_id,
            'Shipping method': 1,
            'First Name': product.name_buyer.split(' ')[0],
            'Last Name': product.name_buyer.split(' ')[1],
            Email: product.buyer_email,
            Phone: '',
            Country: 'US',
            Region: product.state,
            'Address line 1': product.street,
            'Address line 2': '',
            City: product.city,
            Zip: product.zip_code,
            Quantity: product.quantity,
            'Variant ID': key === 'PrintCare' ? product.sku_name : product.variant_id,
            'Print area front': product?.image_design_front || '',
            'Print area back': product?.image_design_back || '',
            'Mockup Front':product?.mockup_front,
            'Mockup Back': product?.mockup_back,
            'Product note': product.note,
            'Link label': product.label,
          };

          if (key === 'PrintCare') {
            result['Tracking ID'] = product.tracking_id;
          }

          return result;
        });

        ExportExcelFile(dataExport, key, dataConvert);
      }
    } catch (error) {
      console.log(error);
      toast.error('Xuất file thất bại. Vui lòng thử lại!');
    } finally {
      setLoadingTableFlashShip(false);
    }
  };

  return (
    <Box>
      {showLink && (
        <Link href={`/shops/${shopId}/fulfillment/completed`} className="mb-5 inline-block" target="_blank">
          <LinkOutlined className="mr-3" />
          Kiểm tra đơn đã tạo thành công
        </Link>
      )}

      <Card className="p-3">
        <Box className="flex items-center justify-between">
          <Typography
            sx={{
              position: 'relative',
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {`Create Order in FlashShip (${flashShipTable.length ? flashShipTable.length : '0'})`}
          </Typography>
          <Box className="flex items-center gap-4">
            {/* <p>Shipment method:</p>
            <Select defaultValue={1} value={flashShipShipment} onChange={(e) => setFlashShipShipment(e.target.value)}>
              <MenuItem value={'1'}>FirstClass</MenuItem>
              <MenuItem value={'2'}>Priority</MenuItem>
              <MenuItem value={'3'}>RushProduction</MenuItem>
            </Select>
            <Button onClick={handleCreateOrderFlashShip} disabled={!tableFlashShipSelected.length} variant="contained">
              Create Order with FlashShip
            </Button> */}
            <Button
              onClick={() => handleExportExcelFile(ordersSelection.selected, 'FlashShip')}
              disabled={!ordersSelection.selected.length}
              variant="contained"
            >
              Export to excel file
            </Button>
          </Box>
        </Box>
        <TableOrderFlashShip
          items={flashShipTable}
          onDeselectAll={ordersSelection.handleDeselectAll}
          onDeselectOne={ordersSelection.handleDeselectOne}
          onSelectAll={ordersSelection.handleSelectAll}
          onSelectOne={ordersSelection.handleSelectOne}
          selected={ordersSelection.selected}
          loadingTable={loadingTableFlashShip}
        />
      </Card>

      <Divider aria-hidden="true" className="!mb-8 !pb-8" />

      <Card className="p-3">
        <Box className="flex items-center justify-between">
          <Typography
            sx={{
              position: 'relative',
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {`Create Order in PrintCare or merchize (${printCareTable.length ? printCareTable.length : '0'})`}
          </Typography>
          <Box className="flex items-center gap-4">
            <Button disabled={true} variant="contained">
              Create order with PrintCare or merchize
            </Button>
            <Button
              onClick={() => handleExportExcelFile(ordersSelectionPrintCare.selected, 'PrintCare')}
              disabled={!ordersSelectionPrintCare.selected.length}
              variant="contained"
            >
              Export to excel file
            </Button>
          </Box>
        </Box>
        <TableOrderPrintCare
          items={printCareTable}
          onDeselectAll={ordersSelectionPrintCare.handleDeselectAll}
          onDeselectOne={ordersSelectionPrintCare.handleDeselectOne}
          onSelectAll={ordersSelectionPrintCare.handleSelectAll}
          onSelectOne={ordersSelectionPrintCare.handleSelectOne}
          selected={ordersSelectionPrintCare.selected}
          loadingTable={loadingTableFlashShip}
        />
      </Card>
    </Box>
  );
};
