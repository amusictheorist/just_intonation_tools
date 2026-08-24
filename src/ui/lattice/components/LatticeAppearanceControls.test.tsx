// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LatticeAppearanceControls from "./LatticeAppearanceControls";

describe("LatticeAppearanceControls", () => {
  it("changes the higher-prime colour", () => {
    const onHigherPrimeColorChange = vi.fn();

    render(
      <LatticeAppearanceControls
        higherPrimeColor="#00008b"
        onHigherPrimeColorChange={onHigherPrimeColorChange}
        showConnections={true}
        onShowConnectionsChange={vi.fn()}
        availableConnectionPrimes={[]}
        visibleConnectionPrimes={null}
        onConnectionPrimeVisibilityChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Higher-prime color"), {
      target: { value: "#800080" },
    });

    expect(onHigherPrimeColorChange).toHaveBeenCalledWith("#800080");
  });

  it("changes whether connections are shown", () => {
    const onShowConnectionsChange = vi.fn();

    render(
      <LatticeAppearanceControls
        higherPrimeColor="#00008b"
        onHigherPrimeColorChange={vi.fn()}
        showConnections={true}
        onShowConnectionsChange={onShowConnectionsChange}
        availableConnectionPrimes={[]}
        visibleConnectionPrimes={null}
        onConnectionPrimeVisibilityChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Show connections" }));

    expect(onShowConnectionsChange).toHaveBeenCalledWith(false);
  });

  it("shows available connection prime axes when connections are enabled", () => {
    render(
      <LatticeAppearanceControls
        higherPrimeColor="#00008b"
        onHigherPrimeColorChange={vi.fn()}
        showConnections={true}
        onShowConnectionsChange={vi.fn()}
        availableConnectionPrimes={[3n, 5n, 11n]}
        visibleConnectionPrimes={null}
        onConnectionPrimeVisibilityChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("checkbox", { name: "3" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "5" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "11" })).toBeChecked();
  });

  it("hides prime-axis controls when connections are disabled", () => {
    render(
      <LatticeAppearanceControls
        higherPrimeColor="#00008b"
        onHigherPrimeColorChange={vi.fn()}
        showConnections={false}
        onShowConnectionsChange={vi.fn()}
        availableConnectionPrimes={[3n, 5n, 11n]}
        visibleConnectionPrimes={null}
        onConnectionPrimeVisibilityChange={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("checkbox", { name: "3" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "5" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "11" }),
    ).not.toBeInTheDocument();
  });

  it("changes connection-prime visibility", () => {
    const onConnectionPrimeVisibilityChange = vi.fn();

    render(
      <LatticeAppearanceControls
        higherPrimeColor="#00008b"
        onHigherPrimeColorChange={vi.fn()}
        showConnections={true}
        onShowConnectionsChange={vi.fn()}
        availableConnectionPrimes={[3n, 5n]}
        visibleConnectionPrimes={null}
        onConnectionPrimeVisibilityChange={onConnectionPrimeVisibilityChange}
      />,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "5" }));

    expect(onConnectionPrimeVisibilityChange).toHaveBeenCalledWith(5n, false);
  });

  it("shows only explicitly visible prime axes as checked", () => {
    render(
      <LatticeAppearanceControls
        higherPrimeColor="#00008b"
        onHigherPrimeColorChange={vi.fn()}
        showConnections={true}
        onShowConnectionsChange={vi.fn()}
        availableConnectionPrimes={[3n, 5n, 11n]}
        visibleConnectionPrimes={new Set([3n, 11n])}
        onConnectionPrimeVisibilityChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("checkbox", { name: "3" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "5" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "11" })).toBeChecked();
  });
});
