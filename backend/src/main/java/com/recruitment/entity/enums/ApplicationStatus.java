package com.recruitment.entity.enums;

public enum ApplicationStatus {
    APPLIED,        // 1. Đã tiếp nhận hồ sơ
    SCREENING,      // 2. Sàng lọc hồ sơ (HR Review)
    INTERVIEW,      // 3. Phỏng vấn (Chuyên môn / Văn hóa)
    ASSESSMENT,     // 4. Bài test / Đánh giá kỹ thuật
    OFFER,          // 5. Gửi đề nghị nhận việc (Offer Letter)
    HIRED,          // 6. Tuyển dụng thành công (Accepted Offer)
    REJECTED,       // 7. Từ chối hồ sơ (Fail vòng nào đó)
    WITHDRAWN       // 8. Ứng viên chủ động rút đơn
}

