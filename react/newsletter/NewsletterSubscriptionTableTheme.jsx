function NewsletterSubscriptionsTableTheme({
  triggerParentUpdate,
  subscribedUsers,
  searchQuery,
  onSearchQueryChange,
}) {
  const [showOnlySubscribed, setShowOnlySubscribed] = useState(null);

  const data = React.useMemo(() => subscribedUsers, [subscribedUsers]);

  const handleSubscriberStatusChange = (row, isSubscribed) => {
    const formData = {
      email: row.original.email,
      isSubscribed: JSON.parse(isSubscribed),
    };

    newsLetterService
      .updateEmail(formData)
      .then((updatedEmail) => onUpdateSuccess(updatedEmail, row))
      .catch(onUpdateError);
  };

  const onUpdateSuccess = (updatedEmail, row) => {
    const updatedUser = {
      ...updatedEmail,
      email: row.original.email,
      dateCreated: row.original.dateCreated,
      dateModified: row.original.dateModified,
    };
    triggerParentUpdate(updatedUser);
  };

  const onUpdateError = (error) => {
    _logger({ error: error });
  };

  const columns = React.useMemo(
    () => [
      { Header: "Email", accessor: "email" },
      {
        Header: "Date of Subscription",
        accessor: "dateCreated",
        Cell: ({ value }) => {
          const date = new Date(value);
          const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };
          return date.toLocaleString(undefined, options);
        },
      },
      {
        Header: "Status",
        accessor: "isSubscribed",
        Cell: ({ value, row }) => {
          return (
            <>
              <div className="form-check form-switch">
                <div>
                  <FormCheck
                    type="switch"
                    id="custom-switch"
                    onChange={() => {
                      value = !value;
                      handleSubscriberStatusChange(row, value);
                    }}
                    checked={value}
                  />
                  <FormCheck.Label
                    style={{ marginLeft: "25px" }}
                    className="form-check-label"
                    htmlFor="flexSwitchCheckDefault"
                  >
                    {value ? "Subscribed" : "Unsubscribed"}
                  </FormCheck.Label>
                </div>
              </div>
            </>
          );
        },
      },
    ],
    []
  );

  const handleShowAll = () => {
    setShowOnlySubscribed(null);
  };

  const handleShowSubscribed = () => {
    setShowOnlySubscribed(true);
  };

  const handleShowUnsubscribed = () => {
    setShowOnlySubscribed(false);
  };

  const filteredUsers = React.useMemo(() => {
    if (showOnlySubscribed === true) {
      return subscribedUsers.filter((user) => user.isSubscribed);
    } else if (showOnlySubscribed === false) {
      return subscribedUsers.filter((user) => !user.isSubscribed);
    } else {
      return subscribedUsers;
    }
  }, [showOnlySubscribed, subscribedUsers]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: filteredUsers,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  );

  const handlePageChange = (page) => {
    gotoPage(page - 1);
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Card>
            <Card.Body className="p-0">
              <div className="Table-responsive border-0 overflow-y-hidden">
                <div className="d-flex justify-content-between px-3 py-2">
                  <div className="d-flex">
                    <FormSelect
                      value={
                        showOnlySubscribed === true
                          ? "Show Subscribed"
                          : showOnlySubscribed === false
                          ? "Show Unsubscribed"
                          : "Show All"
                      }
                      onChange={(e) => {
                        if (e.target.value === "Show Subscribed") {
                          handleShowSubscribed();
                        } else if (e.target.value === "Show Unsubscribed") {
                          handleShowUnsubscribed();
                        } else {
                          handleShowAll();
                        }
                      }}
                      className="mt-3 me-3"
                    >
                      <option value="Show All">Show All</option>
                      <option value="Show Subscribed">Show Subscribed</option>
                      <option value="Show Unsubscribed">
                        Show Unsubscribed
                      </option>
                    </FormSelect>
                    <FormSelect
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="mt-3 me-3"
                    >
                      {[10, 25, 50].map((option) => (
                        <option key={option} value={option}>
                          Show {option}
                        </option>
                      ))}
                    </FormSelect>
                  </div>
                  <div className="d-flex">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => onSearchQueryChange(e.target.value)}
                      placeholder="Search"
                      className="form-control mt-3 me-3"
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    <span>
                      Page{" "}
                      <strong>
                        {pageIndex + 1} of{" "}
                        {Math.ceil(filteredUsers.length / pageSize)}
                      </strong>
                    </span>
                    <Pagination
                      current={pageIndex + 1}
                      total={filteredUsers.length}
                      pageSize={pageSize}
                      onChange={handlePageChange}
                      className="ms-3"
                    />
                  </div>
                </div>
                <Table
                  {...getTableProps()}
                  className="text-nowrap table-columns"
                >
                  <thead className="table-light">
                    {headerGroups.map((headerGroup) => (
                      <tr
                        key={headerGroup.id}
                        {...headerGroup.getHeaderGroupProps()}
                      >
                        {headerGroup.headers.map((column) => (
                          <th key={column.id} {...column.getHeaderProps()}>
                            {column.render("Header")}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr key={row.id} {...row.getRowProps()}>
                          {row.cells.map((cell) => {
                            return (
                              <td
                                key={cell.column.id}
                                {...cell.getCellProps()}
                                className="align-middle url-column"
                              >
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}

NewsletterSubscriptionsTableTheme.propTypes = {
  subscribedUsers: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired,
      dateCreated: PropTypes.string.isRequired,
      dateModified: PropTypes.string.isRequired,
      isSubscribed: PropTypes.bool.isRequired,
    })
  ),
  row: PropTypes.shape({
    original: PropTypes.shape({
      isSubscribed: PropTypes.bool.isRequired,
      email: PropTypes.string.isRequired,
    }),
  }),
  value: PropTypes.string.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchQueryChange: PropTypes.func.isRequired,
  triggerParentUpdate: PropTypes.func.isRequired,
};

export default NewsletterSubscriptionsTableTheme;
