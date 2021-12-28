## ECHINESE - LMS V2

> Framework : next 10.0.0

#### Cài đặt

Clone source code:

```sh
git clone https://github.com/annguyen97dev/LMS-ECHINESE
```

Cài đặt thư viện hỗ trợ:

```sh
npm install
```

Chạy dự án:

```sh
npm run dev
```

**Lưu ý**

-   Không được chỉnh sửa code trên branch master
-   Mỗi người tạo ra branch tên mình hoặc tên chức năng đang làm
-   Mỗi ngày trước khi bắt đầu công việc thì pull từ branch dev về để lấy code mới nhất
-   Sau khi làm xong tính năng thì push lại lên dev để mọi người cập nhật

#### Cấu trúc dự án

```markdown
├───apiBase ⇾ chứa các hàm gọi api
│ ├───types ⇾ chứa type của các kết quả api trả ra
│ └───exam ⇾ mẫu hàm gọi api (thay đổi link và type là dùng được)
├───components -> chứa các componets (lưu ý: tất cả các component đều phải export default)
├───context
│ └───wrap ⇾ chứa các dữ liệu có thể gọi ra ở bất cứ đâu
│ ├───userInformation ⇾ thông tin tài khoản đang đăng nhập
│ ├───useAllRoles ⇾ tất cả các role trong hệ thống
│ ├───useStaffRoles ⇾ các role nhân viên
│ ├───showNoti ⇾ hiện ra các thông báo - VD: showNoti("success", "Thành công")
│ └───pageSize ⇾ số row cho các bảng (sài cho đồng bộ)
├───lib ⇾ chứa những thứ lung tung (fake data....)
├───pages ⇾ chứa các page của hệ thống (không lưu components, lib... trong này)
├───public ⇾ file scss global
│ └───images ⇾ chứa các hình ảnh dùng trong hệ thống (logo, default image...)
├───types ⇾ định nghĩa kiểu dữ liệu typescript
└───utils ⇾ các hàm tiện ích

appConfig.ts ⇾ file config dự án
```

#### Hướng dẫn thêm page:

    - Tạo một thư mục với tên là router đến trang cần tạo trong thư mục **src/pages/** (VD: trang cần tạo là product -> tạo thư mục trong **src/pages/** và đặt tên nó là product). Sau đó tạo file index.tsx => thực hiện chỉnh sửa trong đây.

#### Lấy thông tin của tài khoản hiện tại:

```tsx
import { useWrap } from '~/context/wrap';
// ...
const { userInformation } = useWrap();
```

#### Tạo thông báo:

```tsx
import { useWrap } from '~/context/wrap';
//...
const { showNoti } = useWrap();
//...
showNoti('success', 'Ghi âm thành công');
//...
showNoti('danger', 'Thất bại');
```

#### Hướng dẫn thêm component

-   B1: Tạo thư mục với tên là tên của component trong thư mục **src/components**
-   B2: Tạo file index.jsx (thực hiện code ở đây).

#### Liên hệ

-   Mọi vấn đề liên hệ: <a href="https://t.me/baochau9xx" target="_blank">Bảo Châu</a> hoặc <a href="https://t.me/dotNet_PhiHung1998" target="_blank">Phi Hùng</a>

#### Keyword

-   lms, echinese, monamedia, elearning
