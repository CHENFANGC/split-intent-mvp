import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "@/app/page";

describe("Split Intent app", () => {
  it("moves from create to pay to settled", async () => {
    render(<Page />);

    expect(screen.getByText("Split Intent")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /create intent split/i }));
    const payButton = await screen.findByRole("button", { name: /pay my share/i });

    fireEvent.click(payButton);
    expect(await screen.findByText(/One receiver outcome/i)).toBeInTheDocument();
  });
});
