from logging import Logger, DEBUG, INFO


from backend.lib._logger import LogHelper

logger: Logger = LogHelper.create_logger(
    logger_name="backend API (auth)",
    log_file="backend/logs/auth.log",
    file_log_level=DEBUG,
    stream_log_level=INFO,
)
