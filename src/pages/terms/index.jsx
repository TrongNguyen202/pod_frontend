'use client';

import { Link } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Seo } from 'src/components/seo';
import { Layout as AuthLayout } from 'src/layouts/auth/classic-layout';

const Page = () => {
  return (
    <>
      <Seo title="Terms Of Service" />
      <Box sx={{ width: '60vw', position: 'relative', right: '50%', transform: 'translateX: -50%', px: 2 }}>
        <Box>
          <Typography variant="h2" gutterBottom>
            Điều Khoản Dịch Vụ
          </Typography>
          <Typography variant="h3" gutterBottom>
            Terms Of Service
          </Typography>

          <Typography variant="body1" paragraph>
            Chào mừng bạn đến với Sun Design — nền tảng kết nối khách hàng với đội ngũ nhà thiết kế sáng tạo. Bằng việc
            truy cập và sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản dưới đây.
          </Typography>

          <Typography variant="h4" gutterBottom>
            1. Phạm Vi Áp Dụng
          </Typography>
          <Typography variant="body1" paragraph>
            Điều khoản này áp dụng cho tất cả người dùng truy cập, đăng ký tài khoản, gửi yêu cầu thiết kế hoặc sử dụng
            bất kỳ tính năng nào trên nền tảng Sun Design.
          </Typography>

          <Typography variant="h4" gutterBottom>
            2. Quyền Và Nghĩa Vụ Người Dùng
          </Typography>
          <Typography variant="body1" paragraph>
            Bạn cam kết cung cấp thông tin chính xác, chịu trách nhiệm với nội dung bạn chia sẻ và thanh toán đầy đủ chi
            phí dịch vụ. Bạn không được phép sử dụng nền tảng cho mục đích vi phạm pháp luật hoặc gây hại cho bên thứ
            ba.
          </Typography>

          <Typography variant="h4" gutterBottom>
            3. Quyền Và Nghĩa Vụ Sun Design
          </Typography>
          <Typography variant="body1" paragraph>
            Chúng tôi có quyền điều phối yêu cầu thiết kế của bạn tới đội ngũ nhà thiết kế phù hợp, đảm bảo chất lượng
            và tiến độ. Chúng tôi không chịu trách nhiệm với những trao đổi ngoài nền tảng.
          </Typography>

          <Typography variant="h4" gutterBottom>
            4. Thanh Toán Và Hoàn Tiền
          </Typography>
          <Typography variant="body1" paragraph>
            Bạn đồng ý thanh toán đúng hạn theo báo giá đã thống nhất. Mọi yêu cầu hoàn tiền sẽ được xem xét dựa trên
            chất lượng dịch vụ đã cung cấp và các điều khoản thoả thuận trước.
          </Typography>

          <Typography variant="h4" gutterBottom>
            5. Quyền Sở Hữu Trí Tuệ
          </Typography>
          <Typography variant="body1" paragraph>
            Các thiết kế, hình ảnh, nội dung do nhà thiết kế thực hiện thuộc quyền sở hữu của bạn khi đã thanh toán đầy
            đủ. Sun Design và các nhà thiết kế giữ quyền sử dụng bản demo cho mục đích quảng bá, trừ khi bạn có yêu cầu
            khác bằng văn bản.
          </Typography>

          <Typography variant="h4" gutterBottom>
            6. Bảo Mật Thông Tin
          </Typography>
          <Typography variant="body1" paragraph>
            Chúng tôi cam kết bảo mật thông tin cá nhân của bạn theo{' '}
            <Link href="/privacy" underline="hover" sx={{ color: 'primary.main' }}>
              Chính Sách Bảo Mật
            </Link>
            . Bạn có trách nhiệm giữ an toàn thông tin đăng nhập.
          </Typography>

          <Typography variant="h4" gutterBottom>
            7. Điều Chỉnh Và Chấm Dứt Dịch Vụ
          </Typography>
          <Typography variant="body1" paragraph>
            Chúng tôi có thể điều chỉnh hoặc tạm dừng cung cấp dịch vụ để bảo trì, nâng cấp hoặc vì lý do bất khả kháng.
            Chúng tôi không chịu trách nhiệm bồi thường trong các trường hợp ngoài tầm kiểm soát.
          </Typography>

          <Typography variant="h4" gutterBottom>
            8. Liên Hệ
          </Typography>
          <Typography variant="body1" paragraph>
            Mọi thắc mắc hoặc khiếu nại liên quan đến Điều Khoản Dịch Vụ, vui lòng liên hệ:
            <br />• Email: sundesreal68@gmail.com
            <br />• Địa chỉ:: Hoàng Mai, Hà Nội, Hanoi, Vietnam
            <br />• Số điện thoại: 0968 083 967
            {/* <br />• Địa chỉ: [Địa chỉ công ty] */}
          </Typography>

          <Typography variant="body1" paragraph>
            Bằng việc tiếp tục sử dụng dịch vụ, bạn xác nhận đã đọc và đồng ý với các Điều Khoản Dịch Vụ này.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
