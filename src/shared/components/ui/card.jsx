import * as React from "react";
import PropTypes from "prop-types";
import { cn } from "@/shared/utils/cn";

function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6", className)}
      {...props}
    />
  );
}

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

export { Card, CardContent };
