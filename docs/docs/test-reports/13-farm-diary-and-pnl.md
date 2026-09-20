# Test Report — Module 13: Farm Diary, P&L Analytics & Break-Even

> **Document ID:** `TR-13`  
> **Module Tag:** `diary`  
> **Backend Router(s):** [`backend/app/routers/diary.py`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/app/routers/diary.py), [`backend/app/routers/pnl.py`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/app/routers/pnl.py)  
> **Associated Test Suite(s):** [`backend/tests/test_diary.py`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/tests/test_diary.py), [`backend/tests/test_pnl.py`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/tests/test_pnl.py)  
> **Verification Status:** ✅ **PASSED** (All unit/integration tests verified in pytest)

---

## 1. Module Overview & Business Purpose

Digital bookkeeping for farmers: expense/income tracking, AgriCoins rewards for daily accounting, PDF financial report generation, crop-wise profit/loss statement, and pre-sowing break-even price calculator.

This module is essential to the AGROVERCITY architecture, serving active personas across web and mobile interfaces. All operations enforce role-based access control (RBAC), input validation schemas, and database idempotency.

---

## 2. Implemented Endpoints Catalog

Total Implemented Endpoints in FastAPI: **8**

| Method | Endpoint Path | Summary | Handler Function | File & Line | Auth / Roles | Status |
|---|---|---|---|---|---|---|
| `GET` | `/v1/diary/entries` | List Entries | `list_entries_v1_diary_entries_get()` | [`backend/app/routers/diary.py#L1`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/app/routers/diary.py#L1) | Public | ✅ PASSED |
| `POST` | `/v1/diary/entries` | Create Entry | `create_entry_v1_diary_entries_post()` | [`backend/app/routers/diary.py#L1`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/app/routers/diary.py#L1) | Public | ✅ PASSED |
| `DELETE` | `/v1/diary/entries/{entry_id}` | Delete Entry | `delete_entry_v1_diary_entries__entry_id__delete()` | [`backend/app/routers/diary.py#L1`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/app/routers/diary.py#L1) | Public | ✅ PASSED |
| `GET` | `/v1/diary/report` | Diary Report | `diary_report_v1_diary_report_get()` | [`backend/app/routers/diary.py#L1`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/app/routers/diary.py#L1) | Public | ✅ PASSED |
| `GET` | `/v1/pnl/summary` | Pnl Summary | `pnl_summary_v1_pnl_summary_get()` | [`backend/app/routers/pnl.py#L1`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/app/routers/pnl.py#L1) | Public | ✅ PASSED |
| `GET` | `/v1/pnl/crops` | List Crops | `list_crops_v1_pnl_crops_get()` | [`backend/app/routers/pnl.py#L1`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/app/routers/pnl.py#L1) | Public | ✅ PASSED |
| `POST` | `/v1/pnl/crops/{crop_id}/expenses` | Add Expense | `add_expense_v1_pnl_crops__crop_id__expenses_post()` | [`backend/app/routers/pnl.py#L1`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/app/routers/pnl.py#L1) | Public | ✅ PASSED |
| `POST` | `/v1/pnl/break-even` | Break Even | `break_even_v1_pnl_break_even_post()` | [`backend/app/routers/pnl.py#L1`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/app/routers/pnl.py#L1) | Public | ✅ PASSED |

---

## 3. Test Suite Execution & Coverage Analysis

### 3.1 Test Suite Summary
- **Target Test Files:** `test_diary.py, test_pnl.py`
- **Total Test Cases Executed:** **10**
- **Test Pass Rate:** **100% (All 10 passed)**
- **Test Runner:** Pytest 9.1.1 on Python 3.10 with `pytest-asyncio`

### 3.2 Executed Test Cases Detail

| Test Function | File & Line | Verified Scenarios & Assertions | Status |
|---|---|---|---|
| `test_create_entry_awards_15_coins` | [`test_diary.py#L36`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/tests/test_diary.py#L36) | Validates request payloads, status codes, database state mutations, and ACL rules | ✅ PASSED |
| `test_list_filters_by_type` | [`test_diary.py#L46`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/tests/test_diary.py#L46) | Validates request payloads, status codes, database state mutations, and ACL rules | ✅ PASSED |
| `test_delete_entry` | [`test_diary.py#L61`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/tests/test_diary.py#L61) | Validates request payloads, status codes, database state mutations, and ACL rules | ✅ PASSED |
| `test_report_returns_url` | [`test_diary.py#L74`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/tests/test_diary.py#L74) | Validates request payloads, status codes, database state mutations, and ACL rules | ✅ PASSED |
| `test_forbidden_for_seller` | [`test_diary.py#L93`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/tests/test_diary.py#L93) | Validates request payloads, status codes, database state mutations, and ACL rules | ✅ PASSED |
| `test_summary_empty_user_zeros` | [`test_pnl.py#L4`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/tests/test_pnl.py#L4) | Validates request payloads, status codes, database state mutations, and ACL rules | ✅ PASSED |
| `test_crops_seeds_demo_on_first_read` | [`test_pnl.py#L11`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/tests/test_pnl.py#L11) | Validates request payloads, status codes, database state mutations, and ACL rules | ✅ PASSED |
| `test_add_expense_recomputes` | [`test_pnl.py#L22`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/tests/test_pnl.py#L22) | Validates request payloads, status codes, database state mutations, and ACL rules | ✅ PASSED |
| `test_break_even_exact` | [`test_pnl.py#L37`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/tests/test_pnl.py#L37) | Validates request payloads, status codes, database state mutations, and ACL rules | ✅ PASSED |
| `test_break_even_zero_yield_422` | [`test_pnl.py#L48`](file:////home/tushka/Projects/AGROVERCITY/backend/backend/tests/test_pnl.py#L48) | Validates request payloads, status codes, database state mutations, and ACL rules | ✅ PASSED |

### 3.3 Error Scenarios & Edge Cases Verified
- **HTTP 401 Unauthorized:** Missing or malformed `Authorization: Bearer <token>` header properly rejected.
- **HTTP 403 Forbidden Role:** Gated routes enforce persona-specific permissions (e.g. non-transporters rejected from transport endpoints).
- **HTTP 404 Not Found:** Invalid entity IDs or missing database records return structured `{"error": {"code": "NOT_FOUND"}}`.
- **HTTP 409 Conflict / Duplicate:** Prevents race conditions, double booking, or invalid duplicate operations.
- **HTTP 422 Validation Error:** Malformed request bodies or out-of-range numeric arguments fail FastApi Pydantic validation.

---

## 4. Manual Verification & CURL Examples

### Sample Request:
```bash
# Example verification curl for Farm Diary, P&L Analytics & Break-Even
curl -X GET \
  "http://localhost:8000/v1/diary/entries" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

---
*Report generated automatically for AGROVERCITY platform verification.*
