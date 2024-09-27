'use client';

import { useEffect, useState } from 'react';
import { crawlerOptions, downloadTypeOption, imageLimitOptions, initialCrawl } from './data';
import { senPrintsData, senPrintsData3D, senPrintsHawaiiData } from '../../../constants';
import * as XLSX from 'xlsx';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/system';
import Switch from '@mui/material/Switch';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Col, Row } from 'antd';
import ProductItem from './ProductItem';
import { LoadingCustom } from '../../../components/loading';
import ModalShowError from './ModalShowError';
import ModalUploadProduct from './ModalUploadProduct';
import { method } from 'lodash';
import { items } from 'src/api/file-manager/data';

export const PageCrawlProduct = () => {
  const productListStorage = JSON.parse(localStorage.getItem('productCrawlList'));  
  const userInfo = JSON.parse(localStorage.getItem('user'));
  const [productList, setProductList] = useState(productListStorage || []);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [optionCrawl, setOptionCrawl] = useState(initialCrawl);
  const [loading, setLoading] = useState(false);
  const [isShowModalUpload, setShowModalUpload] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showOutsideImages, setShowOutsideImages] = useState(false);
  // const [username,setUserName] = useState("")
  const [licenseCode, setLicenseCode] = useState({
    code: localStorage.getItem('licenseCode'),
    invalid: !localStorage.getItem('licenseCode'),
  });
  const [modalErrorInfo, setModalErrorInfo] = useState({
    isShow: false,
    data: [],
    title: '',
  });
  const [downloadType, setDownloadType] = useState('excel');
  
  useEffect(() => {
    if (checkedItems && checkedItems.length === 0) return;
    const CountSelectedItems = Object.values(checkedItems).filter((value) => value === true).length;
    if (CountSelectedItems === productList.length) {
      setIsAllChecked(true);
    } else setIsAllChecked(false);
  }, [checkedItems]);

  const handleDeleteProduct = (product_id) => {
    const newProductList = productList.filter((item) => item.id !== product_id);
    setProductList(newProductList);
  };

  const handleChangeProduct = (newProduct) => {
    const newProductList = productList.map((item) => {
      if (item.id === newProduct.id) {
        return newProduct;
      }
      return item;
    });
    setProductList(newProductList);
  };

  const handleCheckChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const handleCheckAllChange = (event) => {
    if (!productList || !productList.length) {
      return;
    }
    const newCheckedItems = productList.reduce((acc, cur) => {
      acc[cur.id] = event.target.checked;
      return acc;
    }, {});
    setCheckedItems(newCheckedItems);
  };

  const CountSelectedItems = Object.values(checkedItems).filter((value) => value === true).length;

  const renderProductList = () => {
    return loading ? (
      <Stack justifyContent="center" alignItems="center">
        <LoadingCustom />
      </Stack>
    ) : (
      <Row gutter={[16, 16]} className="flex py-5 transition-all duration-300">
        {productList.map((item, index) => {          
          return (
            <Col span={4} key={item.id}>
              <ProductItem
                product={item}
                index={index}
                handleDeleteProduct={handleDeleteProduct}
                checkedItems={checkedItems}
                handleCheckChange={handleCheckChange}
                handleChangeProduct={handleChangeProduct}
                showSkeleton={showSkeleton}
                showOutsideImages={showOutsideImages}
              />
            </Col>
          );
        })}
      </Row>
    );
  };

  const onChangeOptionCrawl = (key, value) => {
    console.log({
      ...optionCrawl,
      [key]: value,
    });
    setOptionCrawl({
      ...optionCrawl,
      [key]: value,
    });
  };
  const scrapeUserInsta = async (username) => {
    try {
        const response = await axios.get(
            `http://localhost:8000/api/crawl-insta?username=${username}`,
            {
                headers: {
                    "x-ig-app-id": "936619743392459",
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
                    "Accept-Language": "en-US,en;q=0.9,ru;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept": "*/*",
                },
            }
        );

        if (response.status === 200) {
            const dataInsta = response.data.data;

            // Assuming dataInsta contains the list of products or media, you can now set the product list
            if (dataInsta && Array.isArray(dataInsta)) {
                setProductList(dataInsta); // Set your product list or media data here
                setLoading(false)
            } else {
                console.error("No media data available.");
            }
        } else {
            console.error("Failed to retrieve data. Status:", response.status);
        }
    } catch (error) {
        console.error("Failed to retrieve data:", error);
    }
};

  const fetchInfoProducts = async (ids, productData) => {
    setLoading(true);
    const headers = {
      accept: 'application/json',
      authority: 'vk1ng.com',
      'accept-language': 'vi,vi-VN;q=0.9,en-US;q=0.8,en;q=0.7',
      'content-type': 'application/json',
      authorization: `Bearer ${licenseCode.code}`,
      referer: 'https://www.etsy.com/',
      'sec-ch-ua-mobile': '?0',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'sec-ch-ua-platform': 'Windows',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    };
    fetch(`https://vk1ng.com/api/bulk/listings/${ids}`, {
      method: 'GET',
      headers,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.message === 'Unauthenticated.') {
          toast.error('Please enter the correct lincense code!');
          setLicenseCode({ code: '', invalid: true });
          return;
        }
        const combineProducts = productData.map((item) => {
          const product = data.data.find((product) => item.siteProductId === String(product.listing_id));
          return {
            ...item,
            ...product,
          };
        });
        
        setProductList(combineProducts);
        // localStorage.setItem('productList', JSON.stringify(combineProducts));
      })
      .catch((error) => {
        toast.error(error?.data?.message);
      })
      .finally(() => {
        setLoading(false);
        setShowSkeleton(false);
      });
  };

  const fetchDataProductList = async (url, crawler) => {
    setLoading(true);
    // lấy danh sách url từ textarea và split theo dòng
    const urlsList = url
      .trim()
      .split('\n')
      .filter((line) => line.trim() !== '');
    // nếu url không bắt đầu bằng http thì là id sản phẩm -> thêm đầu link etsy
    const urls = urlsList.map((url) => (url.startsWith('http') ? url : `https://www.etsy.com/listing/${url}`));
    const params = {
      crawler,
    };
    const fetchProductList = async (url) => {
      return axios({
        method: 'post',
        url: `https://kaa.iamzic.com/api/v1/crawl.json?crawlURL=${url}`,
        data: params,
      }).catch((error) => ({ error }));
    };

    // gọi đồng thời các request lấy dữ liệu sản phẩm
    const responses = await Promise.allSettled(urls.map((url) => fetchProductList(url)));
    // concat các sản phẩm vào chung 1 mảng
    console.log("data cao", responses)
    const productData = responses
      .filter((response) => response.status === 'fulfilled' && response.value.data)
      .reduce((acc, response) => {
        const { data } = response.value;
        return [...acc, ...data.data];
      }, []);

    // giới hạn ảnh theo imagesLimit
    productData.forEach((product) => {
      product.images = product.images.slice(0, optionCrawl.imagesLimit);
      // kiểm tra từng phần tử trong product.images, nếu url chứa 'https://i.etsystatic.com' thì giảm dung lượng link ảnh bằng 1200x1200
      // const newImages = product.images.map((image) => {
      //   if (image.url.includes('https://i.etsystatic.com')) {
      //     return {
      //       ...image,
      //       url: image.url.replace('fullxfull', '1200x1200'),
      //     };
      //   }
      //   return image;
      // });
      // product.images = newImages;
    });
    // lấy danh sách id của sản phẩm để get thông tin sản phẩm
    const ids = productData.map((item) => item.id.split('.')[0]).join(',');
    console.log("product data", productData)
    setProductList(productData);
    localStorage.setItem('productCrawlList', JSON.stringify(productData));
    setCheckedItems([]);
    setIsAllChecked(false);
    setShowSkeleton(true);
    if (optionCrawl.crawler === 'Etsy') await fetchInfoProducts(ids, productData);
    if(optionCrawl.crawler==="Instagram") await scrapeUserInsta(optionCrawl.url)

    else {
      setLoading(false);
      setShowSkeleton(false);
    } 
  };

  const handleCrawl = async () => {
    if (!optionCrawl.url) return;
    await fetchDataProductList(optionCrawl.url, optionCrawl.crawler);
  };

  const convertDataProducts = (isCreateProduct) => {
    const selectedProducts = productList.filter((product) => checkedItems[product.id]);

    const convertImageLink = (images) => {
      return images.reduce((obj, link, index) => {
        const key = `image${index + 1}`;
        obj[key] = link.url;
        return obj;
      }, {});
    };

    return selectedProducts.map((product) => {
      if (isCreateProduct) {
        return {
          sku: product.sku,
          title: product.title,
          warehouse: '',
          description: '',
          images: { ...convertImageLink(product.images) },
        };
      }
      return {
        sku: '',
        title: product.title,
        warehouse: '',
        description: '',
        ...convertImageLink(product.images),
      };
    });
  };

  const convertDataProductsToSenPrints = () => {
    const selectedProducts = productList.filter((product) => checkedItems[product.id]);

    const convertImageLink = (images) => {
      return images.reduce((obj, link, index) => {
        const key = `mockup_url_${index + 1}`;
        obj[key] = link.url;
        return obj;
      }, {});
    };

    if (downloadType === 'SenPrintsHawaiian') {
      11;
      return selectedProducts.flatMap((product) => {
        return {
          campaign_name: `${product.title} ${userInfo?.user_code ? `- ${userInfo.user_code}` : ''}`,
          campaign_desc: senPrintsHawaiiData.campaign_desc,
          collection: '',
          product_sku: senPrintsHawaiiData.product_sku,
          price: senPrintsData[0].price,
          ...convertImageLink(product.images),
        };
      });
    }

    if (downloadType === 'SenPrints3D') {
      return selectedProducts.flatMap((product) => {
        return senPrintsData3D.map((item) => {
          return {
            campaign_name: `${product.title} ${userInfo?.user_code ? `- ${userInfo.user_code}` : ''}`,
            campaign_desc: item.campaign_desc,
            collection: '',
            product_sku: item.product_sku,
            price: item.price,
            ...convertImageLink(product.images),
          };
        });
      });
    }

    return selectedProducts.flatMap((product) => {
      return senPrintsData.map((item) => {
        return {
          campaign_name: `${product.title} ${userInfo?.user_code ? `- ${userInfo.user_code}` : ''}`,
          campaign_desc: item.campaign_desc,
          collection: '',
          product_sku: item.product_sku,
          colors: item.colors,
          price: item.price,
          ...convertImageLink(product.images),
        };
      });
    });
  };

  const handleExportExcel = () => {
    const data = convertDataProducts();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'productList.xlsx');
    setCheckedItems([]);
    setIsAllChecked(false);
  };

  const handleExportSenPrints = () => {
    const data = convertDataProductsToSenPrints();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'senprints.xlsx');
    setCheckedItems([]);
    setIsAllChecked(false);
  };

  const onExportByType = () => {
    if (downloadType === 'excel') handleExportExcel();
    if (downloadType === 'senPrints') handleExportSenPrints();
    if (downloadType === 'SenPrintsHawaiian') handleExportSenPrints();
    if (downloadType === 'SenPrints3D') handleExportSenPrints();
  };

  const onSaveLicenseCode = () => {
    localStorage.setItem('licenseCode', licenseCode.code);
    setLicenseCode((prev) => ({ ...prev, invalid: false }));
  };

  const copyToClipboard = (content) => {
    const tempInput = document.createElement('input');
    tempInput.value = content;
    document.body.appendChild(tempInput);

    tempInput.select();
    tempInput.setSelectionRange(0, 99999);

    try {
      document.execCommand('copy');
      toast.success(`copied`);
    } catch (err) {
      toast.error(`${err} copy!`);
    }

    document.body.removeChild(tempInput);
  };

  const handleFileUpload = (e) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      // chuyển đổi data từ file excel sang json
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      let convertJson = [];
      if (Array.isArray(jsonData) && jsonData.length) {
        convertJson = jsonData.map((item) => {
          const { sku, title, warehouse, description } = item;
          const handleImages = (item) => {
            const images = [];
            for (let i = 1; i <= 9; i++) {
              if (item[`image${i}`] || item[`images${i}`]) {
                images.push({
                  url: item[`image${i}`] || item[`images${i}`],
                  id: uuidv4(),
                });
              }
            }
            return images;
          };

          return {
            id: uuidv4(),
            sku: sku || null,
            title: title || null,
            warehouse: warehouse || null,
            description: description || null,
            images: handleImages(item),
          };
        });
      }
      const jsonFilter = convertJson.filter((data) => data.title);

      setProductList(jsonFilter);
    };

    reader.readAsArrayBuffer(e.target.files[0]);
    return false;
  };

  const importDataExtension = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        const data = JSON.parse(text);
        setProductList(data);
        toast.success('Import data extension successfully');
      })
      .catch((err) => {
        toast.error('Failed to read clipboard contents');
      });
  };
  
  return (
    <Stack direction="column" spacing={2}>
      <Card>
        <CardHeader title="Xin mời nhập dữ liệu" sx={{ pb: 0, pt: 2 }} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item container spacing={1}>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  placeholder="Nhập license code tại đây"
                  label="License code"
                  variant="outlined"
                  onChange={(e) => setLicenseCode((prev) => ({ ...prev, code: e.target.value }))}
                />
              </Grid>
              <Grid item xs={2}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                  <Button variant="contained" size="small" onClick={onSaveLicenseCode} fullWidth>
                    Lưu
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            <Grid item container spacing={1}>
              <Grid item xs={6}>
                <OutlinedInput
                  fullWidth
                  name="url"
                  placeholder="Paste URL"
                  multiline
                  rows={4}
                  onChange={(e) => onChangeOptionCrawl('url', e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <Stack direction="column" justifyContent="space-between" sx={{ height: '100%' }}>
                  <TextField
                    fullWidth
                    label="Limit"
                    name="limit"
                    select
                    SelectProps={{ native: true }}
                    onChange={(e) => onChangeOptionCrawl('imagesLimit', e.target.value)}
                  >
                    {imageLimitOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Type"
                    name="type"
                    select
                    SelectProps={{ native: true }}
                    onChange={(e) => onChangeOptionCrawl('crawler', e.target.value)}
                  >
                    {crawlerOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                  <Button size="small" variant="contained" onClick={handleCrawl} loading={loading.toString()} fullWidth>
                    Crawl
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                <Typography variant="h7">Maybe you need: </Typography>
                <Typography variant="h6">https://www.etsy.com/search?q=shirt&ref=search_bar</Typography>
                <ContentCopyIcon
                  onClick={() => copyToClipboard('https://www.etsy.com/search?q=shirt&ref=search_bar', 'link')}
                  className="hover:cursor-pointer"
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  size="small"
                >
                  Upload file
                  <VisuallyHiddenInput type="file" accept=".xlsx, .xls" multiple={false} onChange={handleFileUpload} />
                </Button>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<DriveFileRenameOutlineIcon />}
                  onClick={importDataExtension}
                  size="small"
                >
                  Import data extension
                  <VisuallyHiddenInput type="file" />
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                <Box>
                  <FormControlLabel
                    control={<Checkbox onChange={handleCheckAllChange} checked={isAllChecked} />}
                    label="Select all"
                  />
                </Box>
                <Typography variant="h7">{`Total: ${productList ? productList.length : 0} products`}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item container xs={12} spacing={2} alignItems="center">
              <Grid item xs={8}>
                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={2}
                  sx={{ height: '100%' }}
                >
                  <TextField
                    label="Download type"
                    name="category"
                    select
                    SelectProps={{ native: true }}
                    onChange={(value) => setDownloadType(value)}
                  >
                    {downloadTypeOption.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<FileDownloadIcon />}
                    disabled={CountSelectedItems === 0}
                    onClick={onExportByType}
                  >
                    Export excel
                  </Button>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<FileUploadIcon />}
                    disabled={CountSelectedItems === 0}
                    onClick={() => setShowModalUpload(true)}
                  >
                    Upload product
                  </Button>
                  <Typography variant="h7">{`${CountSelectedItems} products`}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ height: '100%' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="allDay"
                        defaultChecked={false}
                        onChange={() => setShowOutsideImages(!showOutsideImages)}
                      />
                    }
                    label="Show the outside images"
                  />
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Kết quả" sx={{ pb: 0, pt: 2 }} />
        <CardContent>{productList && productList?.length ? renderProductList() : null}</CardContent>
      </Card>
      {isShowModalUpload && (
        <ModalUploadProduct
          isShowModalUpload={isShowModalUpload}
          setShowModalUpload={setShowModalUpload}
          productList={convertDataProducts(true)}
          imagesLimit={optionCrawl.imagesLimit}
          modalErrorInfo={modalErrorInfo}
          setModalErrorInfo={setModalErrorInfo}
        />
      )}

      {modalErrorInfo.isShow && (
        <ModalShowError setModalErrorInfo={setModalErrorInfo} modalErrorInfo={modalErrorInfo} />
      )}
    </Stack>
  );
};



const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
