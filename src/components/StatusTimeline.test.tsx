import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusTimeline } from "@/components/StatusTimeline";

describe("StatusTimeline", () => {
  it("renders signed, delivered, and settled steps", () => {
    render(<StatusTimeline activeStatus="delivered" />);

    expect(screen.getByText("Signed")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByText("Settled")).toBeInTheDocument();
  });
});

