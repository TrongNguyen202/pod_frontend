'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Seo } from 'src/components/seo';
import { Layout as AuthLayout } from 'src/layouts/auth/classic-layout';

const Page = () => {
  return (
    <>
      <Seo title="Privacy policy" />
      <Box sx={{ width: '60vw', position: 'relative', right: '50%', transform: 'translateX: -50%', px: 2 }}>
        <Box sx={{ my: 1 }}>
          <Typography variant="h2" gutterBottom>
            Chính Sách Bảo Mật
          </Typography>
          <Typography variant="h3" gutterBottom>
            Privacy policy
          </Typography>

          <Typography variant="body1" paragraph>
            Chào mừng bạn đến với Sun Design. Chúng tôi là nền tảng kết nối khách hàng với đội ngũ nhà thiết kế chuyên
            nghiệp, giúp bạn hiện thực hoá ý tưởng thành những bản thiết kế độc đáo, phù hợp với nhu cầu và mong muốn
            của riêng bạn.
          </Typography>

          <Typography variant="body1" paragraph>
            Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản về thu thập, sử dụng và bảo vệ thông
            tin cá nhân như quy định trong chính sách này.
          </Typography>

          <Typography variant="h4" gutterBottom>
            1. Mục Đích Thu Thập Thông Tin
          </Typography>

          <Typography variant="body1" paragraph>
            Chúng tôi thu thập các thông tin cơ bản như họ tên, địa chỉ email, số điện thoại, yêu cầu thiết kế, thông
            tin thanh toán, và các trao đổi giữa bạn với nhà thiết kế. Mục đích nhằm:
          </Typography>

          <Typography variant="body1" paragraph>
            • Cung cấp dịch vụ kết nối nhanh chóng và phù hợp.
            <br />
            • Hỗ trợ xử lý đơn hàng, thanh toán và chăm sóc khách hàng.
            <br />
            • Cải thiện chất lượng sản phẩm và trải nghiệm người dùng.
            <br />• Gửi thông tin khuyến mãi, ưu đãi (nếu được bạn đồng ý).
          </Typography>

          <Typography variant="h4" gutterBottom>
            2. Phạm Vi Sử Dụng Thông Tin
          </Typography>

          <Typography variant="body1" paragraph>
            Thông tin của bạn chỉ được sử dụng trong nội bộ công ty và các đối tác thiết kế đã ký kết hợp đồng, cam kết
            tuân thủ quy định bảo mật. Chúng tôi cam kết không bán hoặc chia sẻ dữ liệu cá nhân cho bên thứ ba không
            liên quan, trừ trường hợp pháp luật yêu cầu.
          </Typography>

          <Typography variant="h4" gutterBottom>
            3. Thời Gian Lưu Trữ Thông Tin
          </Typography>

          <Typography variant="body1" paragraph>
            Thông tin cá nhân của khách hàng sẽ được lưu trữ trên hệ thống của Sun Design cho đến khi bạn có yêu cầu huỷ
            bỏ hoặc tự đăng xuất vĩnh viễn. Trong mọi trường hợp, dữ liệu chỉ được giữ tối đa theo quy định của pháp
            luật hiện hành.
          </Typography>

          <Typography variant="h4" gutterBottom>
            4. Bảo Mật Thông Tin
          </Typography>

          <Typography variant="body1" paragraph>
            Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý nghiêm ngặt để bảo mật dữ liệu cá nhân, bao gồm mã hoá
            thông tin, kiểm soát truy cập và đào tạo nhân sự về an toàn dữ liệu. Tuy nhiên, không có phương thức truyền
            tải nào qua Internet hoặc lưu trữ điện tử có thể đảm bảo an toàn tuyệt đối.
          </Typography>

          <Typography variant="h4" gutterBottom>
            5. Quyền Lợi Khách Hàng
          </Typography>

          <Typography variant="body1" paragraph>
            Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xoá thông tin cá nhân của mình bất kỳ lúc nào. Nếu phát hiện thông
            tin bị sử dụng sai mục đích, vui lòng thông báo ngay để chúng tôi kịp thời xử lý.
          </Typography>

          <Typography variant="h4" gutterBottom>
            6. Liên Hệ
          </Typography>

          <Typography variant="body1" paragraph>
            Nếu bạn có bất kỳ câu hỏi nào liên quan đến Chính Sách Bảo Mật hoặc muốn yêu cầu chỉnh sửa, vui lòng liên hệ
            qua:
          </Typography>

          <Typography variant="body1" paragraph>
            • Email: sundesreal68@gmail.com
            <br />• Địa chỉ:: Hoàng Mai, Hà Nội, Hanoi, Vietnam
            <br />• Số điện thoại: 0968083967
          </Typography>

          <Typography variant="h4" gutterBottom>
            7. Thay Đổi Chính Sách
          </Typography>

          <Typography variant="body1" paragraph>
            Chúng tôi có thể cập nhật Chính Sách Bảo Mật này theo thời gian. Mọi thay đổi sẽ được đăng tải tại trang này
            và có hiệu lực ngay khi công bố. Bạn nên kiểm tra thường xuyên để đảm bảo quyền lợi của mình.
          </Typography>

          <Typography variant="body1" paragraph>
            Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của Sun Design.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
