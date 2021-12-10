## Website quản trị - ESTI

> Framework : next 10.0.5
>
> Authentication library: next-auth 3.1.0
>
> UI library: @chakra-ui/react 1.3.4

#### 1. Cấu trúc dự án

```markdown
src

├───api ⇾ chứ các hàm gọi api từ server
├───assets
├───components -> chứa các componet
├───pages ⇾ chứa các page của website
│ ├───account ⇾ đăng nhập/ quên mật khẩu
│ ├───admin ⇾ role admin (role gốc, nếu thêm page sẽ tạo trong này. Các role khác có page này sẽ export từ đây ra)
│ ├───admin-sales ⇾ role admin sales
│ ├───confirm ⇾ trang xác nhận báo giá (click vào email )
│ ├───delivery ⇾ role delivery
│ ├───document ⇾ trang tài liệu sản phẩm (scan qr sẽ vào đây )
│ ├───resetpassword ⇾ trang đặt lại mật khẩu -> từ email
│ ├───sale ⇾ role sale
│ └───shop-manager ⇾ role shop-mananger
├───styles ⇾ file scss global
├───types ⇾ định nghĩa kiểu dữ liệu typescript
└───utilities ⇾ các hàm tiện ích

appConfig.ts ⇾ file config dự án
```

#### 2. Hướng dẫn thêm page

-   Nếu trang cần phân quyền:

    -   B1: Tạo một thư mục với tên là router đến trang cần tạo trong thư mục **src/pages/admin** (VD: trang cần tạo là admin/page1 -> tạo thư mục trong **src/pages/admin** và đặt tên nó là page1). Sau đó tạo file index.tsx => thực hiện chỉnh sửa trong đây.

    -   B2: Nếu các role khác admin cần có trong này, lặp lại các thao tác tương tự như bước 1, thay **admin** thành các thư mục chức năng tương ứng và export page từ thư mục **admin**

    **Phân quyền trong trang :**

    Lấy role hiện tại của tài khoản

    ```tsx
    import { useRoleContext } from '~src/contexts';
    // ...
    const { role } = useRoleContext();
    ```

    Phân quyền cho component

    ```tsx
    import { Role } from '~src/components/Role';

    //...

    <Role roles={['admin']}>// component/JSX element</Role>;
    ```

-   Nếu trang không cần phân quyền có thể tạo trực tiếp trong thư mục **src/pages**

#### 3. Hướng dẫn thêm component

-   B1: Tạo thư mục với tên là tên của component trong thư mục **src/components**
-   B2: Tạo file index.jsx (thực hiện code ở đây), mà file style **<name>.module.scss** (file style của component -> tìm kiếm từ khóa CSS module trên google )

#### 4. Hướng dẫn khởi chạy dự án

**Yêu cầu hệ thống**

-   Hệ điều hành: linux distro, macos, windows
-   Phần mềm: nodejs từ phiên bản 14 trở lên, npm hoặc yarn

**Môi trường development **

-   Từ thư mục chứa file package.json chạy các lệnh sau

    ```shell
    yarn install #or npm install

    yarn dev #or npm run dev
    ```

**Môi trường production **

-   Từ thư mục chứa file package.json chạy các lệnh sau

    ```shell
    yarn install #or npm install

    yarn build #or npm run build

    yarn start #or npm run start
    ```
