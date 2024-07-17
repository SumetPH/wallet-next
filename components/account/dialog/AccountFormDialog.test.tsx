import { describe, expect, test } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import AccountFormDialog from "./AccountFormDialog";
import { render } from "@/test/test-utils";

describe("render AccountFormDialog", () => {
  test('should show "เพิ่มบัญชี" when mode is "create"', () => {
    render(
      <AccountFormDialog mode="create">
        {({ openDialog }) => (
          <button data-testid="btn-open-dialog" onClick={openDialog}>
            test
          </button>
        )}
      </AccountFormDialog>
    );

    fireEvent.click(screen.getByTestId("btn-open-dialog"));

    expect(screen.getByTestId("dialog-title").innerHTML).toBe("เพิ่มบัญชี");
  });

  test('should show "แก้ไขบัญชี" when mode is "edit"', () => {
    render(
      <AccountFormDialog mode="edit">
        {({ openDialog }) => (
          <button data-testid="btn-open-dialog" onClick={openDialog}>
            test
          </button>
        )}
      </AccountFormDialog>
    );

    fireEvent.click(screen.getByTestId("btn-open-dialog"));

    expect(screen.getByTestId("dialog-title").innerHTML).toBe("แก้ไขบัญชี");
  });

  test("check form element", () => {
    render(
      <AccountFormDialog mode="create">
        {({ openDialog }) => (
          <button data-testid="btn-open-dialog" onClick={openDialog}>
            test
          </button>
        )}
      </AccountFormDialog>
    );

    fireEvent.click(screen.getByTestId("btn-open-dialog"));

    expect(screen.getByTestId("input-account-name")).toBeDefined();
    expect(screen.getByTestId("select-account-type")).toBeDefined();
    expect(screen.getByTestId("input-account-balance")).toBeDefined();
    expect(screen.getByTestId("date-picker")).toBeDefined();
    expect(screen.getByTestId("button-submit")).toBeDefined();
    expect(screen.getByTestId("button-cancel")).toBeDefined();
  });
});
